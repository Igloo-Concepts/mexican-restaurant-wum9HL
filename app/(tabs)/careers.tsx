import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { restaurantConfig } from "../../restaurant.config";
import { ActionButton } from "../../components/ActionButton";
import { SafeFormScroll } from "../../components/layout/SafeFormScroll";
import { SectionHeader } from "../../components/SectionHeader";
import { submitLead } from "../../lib/platform";
import { radiusFor, spacing, theme, typography } from "../../theme";

export default function CareersScreen() {
  const options = restaurantConfig.modules?.jobs ?? { enabled: false };
  const roles =
    options.roles && options.roles.length > 0 ? options.roles : ["Chef", "Front of house", "Kitchen porter"];

  const [role, setRole] = useState(roles[0] ?? "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [message, setMessage] = useState("");
  const [availability, setAvailability] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function send() {
    setErr(null);
    setOk(null);
    if (!name.trim() || !message.trim()) {
      setErr("Share your name and a quick note about your experience.");
      return;
    }
    setSubmitting(true);
    try {
      await submitLead({
        kind: "jobs",
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        message: message.trim(),
        meta: {
          role,
          cvUrl: cvUrl.trim() || undefined,
          availability: availability.trim() || undefined,
        },
      });
      setOk("Thanks — application received. We'll be in touch if it's a fit.");
      setName("");
      setEmail("");
      setPhone("");
      setCvUrl("");
      setMessage("");
      setAvailability("");
    } catch (e: any) {
      setErr(
        e?.code === "not_configured"
          ? "Job applications aren't connected yet."
          : "Couldn't submit your application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeFormScroll>
      <SectionHeader title="Join our team" />
      <Text
        style={{ ...typography.body, color: theme.muted, marginBottom: spacing.md }}
      >
        Pick the role you're applying for and tell us a little about yourself.
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: spacing.sm,
          marginBottom: spacing.md,
        }}
      >
        {roles.map((r) => (
          <Pressable
            key={r}
            onPress={() => setRole(r)}
            style={{
              borderRadius: radiusFor(theme.radius),
              borderWidth: 1,
              borderColor: role === r ? theme.accent : theme.muted,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              backgroundColor: role === r ? theme.accent : "transparent",
            }}
          >
            <Text
              style={{
                ...typography.caption,
                color: role === r ? "#fff" : theme.text,
                fontWeight: "600",
              }}
            >
              {r}
            </Text>
          </Pressable>
        ))}
      </View>

      <Field label="Your name" value={name} onChange={setName} />
      <Field label="Email" value={email} onChange={setEmail} keyboardType="email-address" />
      <Field label="Phone" value={phone} onChange={setPhone} keyboardType="phone-pad" />
      <Field label="Availability" value={availability} onChange={setAvailability} placeholder="Full-time from June" />
      <Field label="CV link (Drive / website)" value={cvUrl} onChange={setCvUrl} placeholder="https://…" />
      <Field
        label="Why you'd be a great fit"
        value={message}
        onChange={setMessage}
        multiline
      />

      {err && <Text style={{ color: "#c0392b", marginBottom: spacing.sm }}>{err}</Text>}
      {ok && <Text style={{ color: theme.accent, marginBottom: spacing.sm }}>{ok}</Text>}

      <ActionButton
        label={submitting ? "Sending…" : "Apply now"}
        onPress={submitting ? undefined : send}
        style={{ marginTop: spacing.md }}
      />
    </SafeFormScroll>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "number-pad" | "phone-pad" | "email-address";
  multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={{ ...typography.caption, color: theme.muted, marginBottom: spacing.xs }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.muted}
        keyboardType={keyboardType}
        multiline={multiline}
        style={{
          borderWidth: 1,
          borderColor: theme.muted,
          borderRadius: radiusFor(theme.radius),
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          color: theme.text,
          backgroundColor: theme.surface,
          minHeight: multiline ? 96 : undefined,
          textAlignVertical: multiline ? "top" : "auto",
          ...typography.body,
        }}
      />
    </View>
  );
}
