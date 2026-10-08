"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Download,
  ShieldCheck,
  Smartphone,
  Trash2,
  Unlink,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";

import {
  useAccountProfile,
  useBilling,
  useChangeEmail,
  useConnectedAccounts,
  useDeleteAccount,
  useDisconnectAccount,
  useExportAccountData,
  useSessions,
  useUpdateBilling,
  useUpdatePhone,
  useUpdateProfile,
} from "@/src/hooks/use-account-settings";

export default function AccountPage() {
  /*
   * --------------------------------------------------------------------------
   * Queries
   * --------------------------------------------------------------------------
   */

  const profileQuery = useAccountProfile();
  const billingQuery = useBilling();
  const sessionsQuery = useSessions();
  const accountsQuery = useConnectedAccounts();

  /*
   * --------------------------------------------------------------------------
   * Mutations
   * --------------------------------------------------------------------------
   */

  const updateProfile = useUpdateProfile();
  const updateBilling = useUpdateBilling();
  const changeEmail = useChangeEmail();
  const updatePhone = useUpdatePhone();
  const disconnectAccount = useDisconnectAccount();
  const exportData = useExportAccountData();
  const deleteAccount = useDeleteAccount();

  const profile = profileQuery.data;

  /*
   * --------------------------------------------------------------------------
   * Profile form
   *
   * IMPORTANT:
   * These MUST start as strings.
   * Do not initialize them from `profile` during render.
   * --------------------------------------------------------------------------
   */

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");

  /*
   * --------------------------------------------------------------------------
   * Billing form
   *
   * Every property starts as an empty string so every Input is controlled
   * from the very first render.
   * --------------------------------------------------------------------------
   */

  const [billing, setBilling] = useState({
    fullName: "",
    country: "",
    state: "",
    address: "",
    city: "",
    postalCode: "",
    taxId: "",
  });

  /*
   * --------------------------------------------------------------------------
   * Delete account form
   * --------------------------------------------------------------------------
   */

  const [deleteConfirmation, setDeleteConfirmation] = useState<string>("");
  const [deletePassword, setDeletePassword] = useState<string>("");

  /*
   * --------------------------------------------------------------------------
   * Synchronize profile API data -> form state
   *
   * This runs AFTER render.
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    if (!profile) {
      return;
    }

    setName(profile.name ?? "");
    setPhone(profile.phone ?? "");
  }, [profile]);

  /*
   * --------------------------------------------------------------------------
   * Synchronize billing API data -> form state
   *
   * Every API value is normalized with ?? "".
   * Therefore billing inputs can never receive undefined.
   * --------------------------------------------------------------------------
   */

  useEffect(() => {
    const data = billingQuery.data;

    if (!data) {
      return;
    }

    setBilling({
      fullName: data.fullName ?? "",
      country: data.country ?? "",
      state: data.state ?? "",
      address: data.address ?? "",
      city: data.city ?? "",
      postalCode: data.postalCode ?? "",
      taxId: data.taxId ?? "",
    });
  }, [billingQuery.data]);

  /*
   * --------------------------------------------------------------------------
   * Loading state
   * --------------------------------------------------------------------------
   */

  if (profileQuery.isLoading || billingQuery.isLoading) {
    return (
      <div className="max-w-lg space-y-6">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  /*
   * --------------------------------------------------------------------------
   * No profile
   * --------------------------------------------------------------------------
   */

  if (!profile) {
    return null;
  }

  /*
   * --------------------------------------------------------------------------
   * Submit handlers
   * --------------------------------------------------------------------------
   */

  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      return;
    }

    updateProfile.mutate(trimmedName);
  }

  function submitBilling(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const country = billing.country.trim();

    if (!country) {
      return;
    }

    updateBilling.mutate({
      fullName: billing.fullName.trim() || undefined,
      country,
      state: billing.state.trim() || undefined,
      address: billing.address.trim() || undefined,
      city: billing.city.trim() || undefined,
      postalCode: billing.postalCode.trim() || undefined,
      taxId: billing.taxId.trim() || undefined,
    });
  }

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = newEmail.trim();

    if (!trimmedEmail) {
      return;
    }

    changeEmail.mutate(trimmedEmail);
  }

  function submitPhone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedPhone = phone.trim();

    if (!trimmedPhone) {
      return;
    }

    updatePhone.mutate(trimmedPhone);
  }

  /*
   * --------------------------------------------------------------------------
   * UI
   * --------------------------------------------------------------------------
   */

  return (
    <div className="max-w-lg space-y-6 pb-16">
      {/* ------------------------------------------------------------------ */}
      {/* Profile                                                            */}
      {/* ------------------------------------------------------------------ */}

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>

          <CardDescription>
            Manage the basic information associated with your account.
          </CardDescription>
        </CardHeader>

        <form onSubmit={submitProfile}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>

              <Input
                id="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                maxLength={80}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                value={profile.email ?? ""}
                disabled
              />

              <p className="text-xs text-muted-foreground mb-4">
                Your email can be changed from the Change email section below.
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={
                updateProfile.isPending ||
                name.trim().length < 2
              }
            >
              {updateProfile.isPending ? "Saving..." : "Save changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Billing                                                            */}
      {/* ------------------------------------------------------------------ */}

      <Card>
        <CardHeader>
          <CardTitle>Billing details</CardTitle>

          <CardDescription>
            Information used for billing and invoices.
          </CardDescription>
        </CardHeader>

        <form onSubmit={submitBilling}>
          <CardContent className="space-y-4">
            {/* Full name */}
            <div className="space-y-2">
              <Label htmlFor="billingFullName">
                Full name
              </Label>

              <Input
                id="billingFullName"
                value={billing.fullName}
                onChange={(event) => {
                  setBilling((current) => ({
                    ...current,
                    fullName: event.target.value,
                  }));
                }}
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">
                Country
              </Label>

              <Input
                id="country"
                value={billing.country}
                onChange={(event) => {
                  setBilling((current) => ({
                    ...current,
                    country: event.target.value,
                  }));
                }}
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">
                State / UT
              </Label>

              <Input
                id="state"
                value={billing.state}
                onChange={(event) => {
                  setBilling((current) => ({
                    ...current,
                    state: event.target.value,
                  }));
                }}
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">
                Address
              </Label>

              <Input
                id="address"
                value={billing.address}
                onChange={(event) => {
                  setBilling((current) => ({
                    ...current,
                    address: event.target.value,
                  }));
                }}
              />
            </div>

            {/* City + Postal code */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="city">
                  City
                </Label>

                <Input
                  id="city"
                  value={billing.city}
                  onChange={(event) => {
                    setBilling((current) => ({
                      ...current,
                      city: event.target.value,
                    }));
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">
                  Postal code
                </Label>

                <Input
                  id="postalCode"
                  value={billing.postalCode}
                  onChange={(event) => {
                    setBilling((current) => ({
                      ...current,
                      postalCode: event.target.value,
                    }));
                  }}
                />
              </div>
            </div>

            {/* Tax ID */}
            <div className="space-y-2">
              <Label htmlFor="taxId">
                Tax ID
                <span className="ml-1 text-muted-foreground">
                  (optional)
                </span>
              </Label>

              <Input
                id="taxId"
                value={billing.taxId}
                className="mb-4"
                onChange={(event) => {
                  setBilling((current) => ({
                    ...current,
                    taxId: event.target.value,
                  }));
                }}
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={
                updateBilling.isPending ||
                billing.country.trim().length === 0
              }
            >
              {updateBilling.isPending
                ? "Saving..."
                : "Save billing details"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Change email                                                       */}
      {/* ------------------------------------------------------------------ */}

      <Card>
        <CardHeader>
          <CardTitle>Change email</CardTitle>

          <CardDescription>
            We&apos;ll send a verification link to your new email address
            before making the change.
          </CardDescription>
        </CardHeader>

        <form onSubmit={submitEmail}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentEmail">
                Current email
              </Label>

              <Input
                id="currentEmail"
                value={profile.email ?? ""}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newEmail">
                New email
              </Label>

              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(event) => {
                  setNewEmail(event.target.value);
                }}
                placeholder="you@example.com"
                className="mb-4"
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={
                changeEmail.isPending ||
                newEmail.trim().length === 0
              }
            >
              {changeEmail.isPending
                ? "Sending..."
                : "Continue"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Password                                                           */}
      {/* ------------------------------------------------------------------ */}

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>

          <CardDescription>
            Use a strong password with at least 10 characters.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              window.location.href =
                "/dashboard/account/password";
            }}
          >
            Change password

            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Phone                                                              */}
      {/* ------------------------------------------------------------------ */}

      <Card>
        <CardHeader>
          <CardTitle>Phone number</CardTitle>

          <CardDescription>
            Update the phone number associated with your account.
          </CardDescription>
        </CardHeader>

        <form onSubmit={submitPhone}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone number
              </Label>

              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                }}
                placeholder="+91 98765 43210"
                className="mb-4"
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={
                updatePhone.isPending ||
                phone.trim().length === 0
              }
            >
              {updatePhone.isPending
                ? "Saving..."
                : "Update phone number"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Security                                                           */}
      {/* ------------------------------------------------------------------ */}

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="rounded-md border p-2">
              <ShieldCheck className="h-4 w-4" />
            </div>

            <div>
              <CardTitle>Security</CardTitle>

              <CardDescription>
                Review the sessions currently signed in to your account.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {sessionsQuery.isLoading && (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          )}

          {!sessionsQuery.isLoading &&
            sessionsQuery.data?.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No active sessions found.
              </p>
            )}

          {sessionsQuery.data?.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-muted-foreground" />

                <div>
                  <p className="text-sm font-medium">
                    Current session
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Expires{" "}
                    {new Date(
                      session.expires
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <span className="text-xs text-muted-foreground">
                Active
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Connected accounts                                                 */}
      {/* ------------------------------------------------------------------ */}

      <Card>
        <CardHeader>
          <CardTitle>
            Connected accounts
          </CardTitle>

          <CardDescription>
            Manage external accounts connected to your Skyblip account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {accountsQuery.isLoading && (
            <Skeleton className="h-14 w-full" />
          )}

          {accountsQuery.data?.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div>
                <p className="text-sm font-medium capitalize">
                  {account.provider}
                </p>

                <p className="text-xs text-muted-foreground">
                  {account.type}
                </p>
              </div>

              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={disconnectAccount.isPending}
                onClick={() => {
                  disconnectAccount.mutate(account.id);
                }}
              >
                <Unlink className="mr-2 h-3.5 w-3.5" />
                Disconnect
              </Button>
            </div>
          ))}

          {!accountsQuery.isLoading &&
            accountsQuery.data?.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No connected accounts.
              </p>
            )}
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Account information                                                */}
      {/* ------------------------------------------------------------------ */}

      <Card>
        <CardHeader>
          <CardTitle>
            Account information
          </CardTitle>

          <CardDescription>
            Basic information about your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <InfoRow
            label="Account ID"
            value={profile.id ?? ""}
          />

          <InfoRow
            label="Account type"
            value={profile.role ?? ""}
          />

          <InfoRow
            label="Member since"
            value={
              profile.createdAt
                ? new Date(
                    profile.createdAt
                  ).toLocaleDateString()
                : ""
            }
          />

          <InfoRow
            label="Email status"
            value={
              profile.emailVerified
                ? "Verified"
                : "Not verified"
            }
            icon={
              profile.emailVerified ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : undefined
            }
          />
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Privacy                                                            */}
      {/* ------------------------------------------------------------------ */}

      <Card>
        <CardHeader>
          <CardTitle>
            Privacy & data
          </CardTitle>

          <CardDescription>
            Manage and access the data associated with your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">
              Export your data
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Get a copy of the personal information associated with your
              account.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={exportData.isPending}
            onClick={() => {
              exportData.mutate();
            }}
          >
            <Download className="mr-2 h-4 w-4" />

            {exportData.isPending
              ? "Preparing..."
              : "Export account data"}
          </Button>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Danger zone                                                        */}
      {/* ------------------------------------------------------------------ */}

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">
            Danger zone
          </CardTitle>

          <CardDescription>
            Permanently delete your account and associated data.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">
              Delete account
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              This action is permanent and cannot be undone.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deleteConfirmation">
              Type DELETE to confirm
            </Label>

            <Input
              id="deleteConfirmation"
              value={deleteConfirmation}
              onChange={(event) => {
                setDeleteConfirmation(event.target.value);
              }}
              placeholder="DELETE"
            />
          </div>

          {profile.email && (
            <div className="space-y-2">
              <Label htmlFor="deletePassword">
                Password
              </Label>

              <Input
                id="deletePassword"
                type="password"
                value={deletePassword}
                onChange={(event) => {
                  setDeletePassword(event.target.value);
                }}
                placeholder="Enter your password"
              />
            </div>
          )}

          <Button
            type="button"
            variant="destructive"
            disabled={
              deleteConfirmation !== "DELETE" ||
              deleteAccount.isPending
            }
            onClick={() => {
              deleteAccount.mutate({
                confirmation: "DELETE",
                password:
                  deletePassword || undefined,
              });
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />

            {deleteAccount.isPending
              ? "Deleting..."
              : "Delete account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/*
 * ----------------------------------------------------------------------------
 * Info row
 * ----------------------------------------------------------------------------
 */

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="flex items-center gap-1.5 text-right text-sm">
        {icon}
        {value}
      </span>
    </div>
  );
}