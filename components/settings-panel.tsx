'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Mail, MessageSquare, ShoppingBag } from 'lucide-react';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

interface Integration {
  type: 'gmail' | 'twilio' | 'shopify';
  enabled: boolean;
  apiKey: string;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([
    { type: 'gmail', enabled: false, apiKey: '' },
    { type: 'twilio', enabled: false, apiKey: '' },
    { type: 'shopify', enabled: false, apiKey: '' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('integration_settings')
        .select('*')
        .eq('user_id', userData.user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        const loaded = integrations.map((integration) => {
          const saved = data.find((d) => d.integration_type === integration.type);
          return saved
            ? {
                type: integration.type,
                enabled: saved.enabled,
                apiKey: saved.api_key || '',
              }
            : integration;
        });
        setIntegrations(loaded);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      for (const integration of integrations) {
        const { error } = await supabase
          .from('integration_settings')
          .upsert(
            {
              user_id: userData.user.id,
              integration_type: integration.type,
              enabled: integration.enabled,
              api_key: integration.apiKey,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'user_id,integration_type',
            }
          );

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Integration settings saved',
      });
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateIntegration = (type: string, field: keyof Integration, value: any) => {
    setIntegrations(
      integrations.map((i) => (i.type === type ? { ...i, [field]: value } : i))
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'gmail':
        return <Mail className="w-5 h-5" />;
      case 'twilio':
        return <MessageSquare className="w-5 h-5" />;
      case 'shopify':
        return <ShoppingBag className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getDescription = (type: string) => {
    switch (type) {
      case 'gmail':
        return 'Connect Gmail to track email conversations with clients';
      case 'twilio':
        return 'Connect Twilio for SMS communication tracking';
      case 'shopify':
        return 'Sync Shopify orders and customer data';
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Integration Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {integrations.map((integration) => (
            <Card key={integration.type}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getIcon(integration.type)}
                    <div>
                      <CardTitle className="text-base capitalize">{integration.type}</CardTitle>
                      <CardDescription className="text-sm">
                        {getDescription(integration.type)}
                      </CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={integration.enabled}
                    onCheckedChange={(checked) =>
                      updateIntegration(integration.type, 'enabled', checked)
                    }
                  />
                </div>
              </CardHeader>
              {integration.enabled && (
                <CardContent>
                  <div>
                    <Label htmlFor={`${integration.type}-key`}>API Key</Label>
                    <Input
                      id={`${integration.type}-key`}
                      type="password"
                      value={integration.apiKey}
                      onChange={(e) =>
                        updateIntegration(integration.type, 'apiKey', e.target.value)
                      }
                      placeholder="Enter your API key"
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
