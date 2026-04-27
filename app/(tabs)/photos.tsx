import { useState } from "react";
import { Image, Text, TextInput, View } from "react-native";
import { ActionButton } from "../../components/ActionButton";
import { SafeFormScroll } from "../../components/layout/SafeFormScroll";
import { SectionHeader } from "../../components/SectionHeader";
import { getDeviceId, submitPhoto, usePhotos } from "../../lib/platform";
import { radiusFor, spacing, theme, typography } from "../../theme";

/**
 * Diner photo wall. Photos go through a moderation queue (owner approves
 * from the Manage UI) unless the owner unticks `requireApproval`. We keep
 * submission as "paste a URL" for now — Expo Snack can't reliably upload
 * a picked photo to cloud storage without extra setup.
 */
export default function PhotosScreen() {
  const { data, loading, refresh } = usePhotos();
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function send() {
    setErr(null);
    setStatus(null);
    if (!/^https?:\/\//.test(url.trim())) {
      setErr("Please paste a public image URL (https://…).");
      return;
    }
    setSubmitting(true);
    try {
      await submitPhoto({
        url: url.trim(),
        caption: caption.trim() || undefined,
        submitterName: name.trim() || undefined,
        customerId: getDeviceId(),
      });
      setStatus("Thanks — your photo is in the moderation queue.");
      setUrl("");
      setCaption("");
      refresh();
    } catch (e: any) {
      setErr(
        e?.code === "not_configured"
          ? "Photo wall isn't connected yet."
          : "Couldn't submit your photo. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const photos = data?.photos ?? [];

  return (
    <SafeFormScroll>
      <SectionHeader title="From our diners" />
      <Text
        style={{ ...typography.body, color: theme.muted, marginBottom: spacing.md }}
      >
        Share a photo of your visit. We'll add the best ones to the wall.
      </Text>

      {loading ? (
        <Text style={{ color: theme.muted, marginBottom: spacing.md }}>Loading…</Text>
      ) : photos.length === 0 ? (
        <Text style={{ color: theme.muted, marginBottom: spacing.md }}>
          No photos yet — be the first!
        </Text>
      ) : (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: spacing.sm,
            marginBottom: spacing.lg,
          }}
        >
          {photos.map((p) => (
            <View
              key={p.id}
              style={{
                width: "48%",
                aspectRatio: 1,
                borderRadius: radiusFor(theme.radius),
                overflow: "hidden",
                backgroundColor: theme.surface,
              }}
            >
              <Image
                source={{ uri: p.thumbnailUrl ?? p.url }}
                style={{ flex: 1 }}
                resizeMode="cover"
              />
            </View>
          ))}
        </View>
      )}

      <Field label="Your name" value={name} onChange={setName} />
      <Field label="Photo URL" value={url} onChange={setUrl} placeholder="https://…" />
      <Field label="Caption" value={caption} onChange={setCaption} />

      {err && <Text style={{ color: "#c0392b", marginBottom: spacing.sm }}>{err}</Text>}
      {status && <Text style={{ color: theme.accent, marginBottom: spacing.sm }}>{status}</Text>}

      <ActionButton
        label={submitting ? "Uploading…" : "Submit photo"}
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
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
        style={{
          borderWidth: 1,
          borderColor: theme.muted,
          borderRadius: radiusFor(theme.radius),
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          color: theme.text,
          backgroundColor: theme.surface,
          ...typography.body,
        }}
      />
    </View>
  );
}
