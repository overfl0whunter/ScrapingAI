"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Zap } from "lucide-react"

export default function BillingSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing Settings</h3>
        <p className="text-sm text-muted-foreground">Manage your subscription and payment methods.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are currently on the Free plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Free Plan</h4>
                <p className="text-sm text-muted-foreground">Basic features with limited usage</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$0</p>
                <p className="text-xs text-muted-foreground">per month</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm">
                <Zap className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Up to 100 AI requests per month</span>
              </div>
              <div className="flex items-center text-sm">
                <Zap className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Basic models only</span>
              </div>
              <div className="flex items-center text-sm">
                <Zap className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Community support</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Upgrade to Pro</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No payment methods added yet</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Add Payment Method
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
