"use client";
import React, { useState } from "react";
import { Settings, Bell, Shield, Globe, Database, Key, Save, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-800" /> System Settings
        </h2>
        <p className="text-slate-500 text-sm mt-0.5">Super Admin only — global platform configuration</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardContent className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Platform Name</Label>
                  <Input defaultValue="G-VIMS Gujarat" />
                </div>
                <div className="space-y-1.5">
                  <Label>Platform Version</Label>
                  <Input defaultValue="Phase 1A — v1.0" readOnly className="bg-slate-50" />
                </div>
                <div className="space-y-1.5">
                  <Label>Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="gu">Gujarati</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Time Zone</Label>
                  <Select defaultValue="asia-kolkata">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asia-kolkata">Asia/Kolkata (IST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">KYV & Compliance</h3>
                {[
                  { label: "Compliance alert lead time (days)", defaultValue: "60" },
                  { label: "Audit frequency (months)", defaultValue: "6" },
                  { label: "KYV approval SLA (days)", defaultValue: "14" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center justify-between gap-4">
                    <Label className="flex-1">{f.label}</Label>
                    <Input defaultValue={f.defaultValue} type="number" className="w-24 text-right" />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Pay & Play</h3>
                {[
                  { label: "Slot booking window (days ahead)", defaultValue: "30" },
                  { label: "Cancellation window (hours)", defaultValue: "24" },
                  { label: "Max concurrent P&P slots per citizen", defaultValue: "3" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center justify-between gap-4">
                    <Label className="flex-1">{f.label}</Label>
                    <Input defaultValue={f.defaultValue} type="number" className="w-24 text-right" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="p-5 space-y-4">
              {[
                { label: "SLA breach alerts", desc: "Notify relevant officers when booking SLA is breached", default: true },
                { label: "Compliance expiry reminders", desc: "Alert 60, 30, and 7 days before certificate expiry", default: true },
                { label: "New venue intake notifications", desc: "Notify SPOC when field officer submits intake", default: true },
                { label: "Payment receipt notifications", desc: "Send receipts to requesters on payment confirmation", default: true },
                { label: "Daily digest emails", desc: "Morning summary of pending approvals for DSOs/SPOCs", default: false },
                { label: "CAG audit export emails", desc: "Monthly ledger export to audit team", default: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.default} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardContent className="p-5 space-y-5">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Key className="h-4 w-4" /> Authentication
                </h3>
                {[
                  { label: "Require Aadhaar OTP for all approvals", default: true },
                  { label: "Require NIC e-Sign for Pay & Play toggles", default: true },
                  { label: "Force 2FA for Super Admin & SPOC", default: true },
                  { label: "Session timeout (minutes)", type: "number", default: "30" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Label className="flex-1">{item.label}</Label>
                    {item.type === "number" ? (
                      <Input defaultValue={item.default as string} type="number" className="w-24 text-right" />
                    ) : (
                      <Switch defaultChecked={item.default as boolean} />
                    )}
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Database className="h-4 w-4" /> Data & Privacy (DPDP Act 2023)
                </h3>
                {[
                  { label: "Citizen data retention period (months)", type: "number", default: "36" },
                  { label: "Enable right-to-erasure requests", default: true },
                  { label: "Audit log retention (years)", type: "number", default: "7" },
                  { label: "PII masking in exports", default: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Label className="flex-1">{item.label}</Label>
                    {item.type === "number" ? (
                      <Input defaultValue={item.default as string} type="number" className="w-24 text-right" />
                    ) : (
                      <Switch defaultChecked={item.default as boolean} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardContent className="p-5 space-y-4">
              {[
                { name: "UIDAI Aadhaar OTP", status: "Connected", color: "success" as const, desc: "Citizen identity verification" },
                { name: "NIC e-Sign API", status: "Connected", color: "success" as const, desc: "Digital signature for approvals" },
                { name: "Digital Gujarat SSO", status: "Connected", color: "success" as const, desc: "Official staff authentication" },
                { name: "Razorpay Payment Gateway", status: "Connected", color: "success" as const, desc: "Commercial & P&P payments" },
                { name: "PFMS / Bharat Kosh", status: "Configured", color: "warning" as const, desc: "Government payment integration" },
                { name: "DigiLocker", status: "Connected", color: "success" as const, desc: "Compliance document vault" },
                { name: "NSRS Athlete Registry", status: "Pending", color: "ghost" as const, desc: "Athlete subsidies & data push" },
                { name: "OLA Maps SDK", status: "Connected", color: "success" as const, desc: "Geo-fencing & navigation" },
              ].map((integration) => (
                <div key={integration.name} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-blue-200 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{integration.name}</p>
                    <p className="text-xs text-slate-500">{integration.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={integration.color}>{integration.status}</Badge>
                    <Button variant="outline" size="sm" className="h-7 text-xs">Configure</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button onClick={handleSave} className={saved ? "bg-green-600 hover:bg-green-700" : ""}>
          {saved ? <><RefreshCw className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Settings</>}
        </Button>
        <Button variant="outline">Reset to Defaults</Button>
      </div>
    </div>
  );
}
