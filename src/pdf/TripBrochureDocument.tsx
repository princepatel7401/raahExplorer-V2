import { Document, Link, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer";
import type { Trip, TripDeparture, TripPackageBundle } from "../types/site";
import { registerBrochureFonts } from "./brochureFonts";

const brand = {
  leaf: "#4b6a48",
  text: "#111111",
  muted: "#444444",
  line: "#d8d8d8",
  bg: "#f5f7f6",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Poppins",
    fontWeight: 400,
    fontSize: 7.2,
    lineHeight: 1.12,
    color: brand.text,
    backgroundColor: "#ffffff",
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 6,
  },
  headerLeft: { flex: 1, minWidth: 0 },
  headerRight: { width: 230, alignItems: "flex-end" },
  brandName: { fontSize: 8.8, fontFamily: "Poppins", fontWeight: 700, color: brand.leaf, lineHeight: 1.05 },
  generatedAt: { fontSize: 6.8, fontFamily: "Poppins", fontWeight: 400, color: brand.muted, marginTop: 1 },
  h1: {
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: 700,
    color: brand.text,
    lineHeight: 1.12,
    marginBottom: 2,
    marginTop: 0,
    letterSpacing: -0.2,
  },
  sub: { fontSize: 7.2, fontFamily: "Poppins", fontWeight: 400, color: brand.muted, marginBottom: 2, lineHeight: 1.1 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 2 },
  chip: {
    fontSize: 6.9,
    fontFamily: "Poppins",
    fontWeight: 600,
    paddingVertical: 2,
    paddingHorizontal: 4,
    backgroundColor: brand.bg,
    borderWidth: 1,
    borderColor: brand.line,
    borderRadius: 5,
    color: brand.muted,
    lineHeight: 1.1,
  },
  layout: { flexDirection: "row", gap: 10 },
  leftCol: { flex: 1, minWidth: 0 },
  rightCol: { width: 250, minWidth: 250 },

  pkgSection: { marginTop: 2 },
  pkgTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 },
  pkgTitle: { fontSize: 8.4, fontFamily: "Poppins", fontWeight: 700, color: brand.leaf, lineHeight: 1.1 },
  pkgMeta: { fontSize: 7.2, fontFamily: "Poppins", fontWeight: 600, color: brand.text, lineHeight: 1.1, textAlign: "right" },
  pkgGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 6, columnGap: 6 },
  pkgBlock: { width: "49%", borderWidth: 1, borderColor: brand.line, borderRadius: 7, padding: 6 },
  pkgBlockTitle: { fontSize: 7.6, fontFamily: "Poppins", fontWeight: 700, color: brand.text, lineHeight: 1.1, marginBottom: 3 },
  pkgItem: { fontSize: 7.0, fontFamily: "Poppins", fontWeight: 400, color: brand.text, lineHeight: 1.12, marginTop: 1 },

  card: { borderWidth: 1, borderColor: brand.line, borderRadius: 7, padding: 7, marginBottom: 6 },
  cardTitle: { fontSize: 7.4, fontFamily: "Poppins", fontWeight: 700, color: brand.leaf, marginBottom: 4, lineHeight: 1.1 },
  price: { fontSize: 7.0, fontFamily: "Poppins", fontWeight: 700, color: brand.leaf, lineHeight: 1.12 },
  dayNode: { marginTop: 3, paddingTop: 3, borderTopWidth: 1, borderTopColor: brand.line },
  dayNodeTitle: { fontSize: 7.1, fontFamily: "Poppins", fontWeight: 700, color: brand.text, lineHeight: 1.12 },
  dayNodeSummary: { fontSize: 6.6, fontFamily: "Poppins", fontWeight: 400, color: brand.muted, lineHeight: 1.12, marginTop: 1 },
  dayNodeAct: { fontSize: 6.8, fontFamily: "Poppins", fontWeight: 400, color: brand.text, lineHeight: 1.12, marginTop: 1 },

  footer: { marginTop: 4, borderTopWidth: 1, borderTopColor: brand.line, paddingTop: 4 },
  privacyOneLine: { fontSize: 6.4, fontFamily: "Poppins", fontWeight: 400, color: brand.muted, lineHeight: 1.1 },

  sectionTitle: { fontSize: 8, fontFamily: "Poppins", fontWeight: 700, color: brand.leaf, marginTop: 6, marginBottom: 4 },
  daysRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  dayCard: { width: "24%", borderWidth: 1, borderColor: brand.line, borderRadius: 7, padding: 6, marginBottom: 6 },
  dayCardTitle: { fontSize: 7.2, fontFamily: "Poppins", fontWeight: 700, color: brand.text, lineHeight: 1.12 },
  dayCardSummary: { fontSize: 6.6, fontFamily: "Poppins", fontWeight: 400, color: brand.muted, lineHeight: 1.12, marginTop: 2 },
  dayCardAct: { fontSize: 6.6, fontFamily: "Poppins", fontWeight: 400, color: brand.text, lineHeight: 1.12, marginTop: 1 },
});

function formatInr(amount: number) {
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function departurePrice(pkg: TripPackageBundle, dep: TripDeparture) {
  return dep.pricePerPersonInr ?? pkg.pricePerPersonInr;
}

// Note: User requested no truncation/limits for the single-page PDF.

export type TripBrochureDocumentProps = {
  trip: Trip;
  pkg: TripPackageBundle;
  brandName: string;
  generatedAt: string;
};

export function TripBrochureDocument({ trip, pkg, brandName, generatedAt }: TripBrochureDocumentProps) {
  registerBrochureFonts();

  const includes = pkg.includes ?? trip.includes;
  const excludes = pkg.excludes ?? trip.excludes;

  // No limits requested (single page micro layout will shrink typography instead).
  const departuresAll = trip.departures;
  const highlightsAll = trip.highlights;
  const includesAll = includes;
  const excludesAll = excludes;
  const hotelsAll = pkg.hotels;
  const itineraryAll = pkg.itinerary;

  const privacyOneLine =
    "Privacy & Terms: Full policy applies as on https://www.raahexplorer.com/. Prices/availability subject to confirmation.";

  const itineraryDays = itineraryAll;

  return (
    <Document title={`${trip.title} — Brochure`} author={brandName} subject="Travel package brochure">
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.h1}>{trip.title}</Text>
            <Text style={styles.sub}>
              {trip.location} · {trip.category.toUpperCase()} · {trip.durationDays}D/{trip.durationNights}N
            </Text>
            <View style={styles.chipRow}>
              <Text style={styles.chip}>{pkg.label} package</Text>
              <Text style={styles.chip}>{formatInr(pkg.pricePerPersonInr)} / person</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.brandName}>{brandName}</Text>
            <Text style={styles.generatedAt}>Generated {generatedAt}</Text>
          </View>
        </View>

        <View style={styles.layout}>
          <View style={styles.leftCol}>
            {/* Package details (horizontal blocks) */}
            <View style={styles.pkgSection}>
              <View style={styles.pkgTopRow}>
                <Text style={styles.pkgTitle}>Package</Text>
                <Text style={styles.pkgMeta}>
                  {pkg.label} · {formatInr(pkg.pricePerPersonInr)} / person
                </Text>
              </View>

              <View style={styles.pkgGrid}>
                <View style={styles.pkgBlock} wrap={false}>
                  <Text style={styles.pkgBlockTitle}>Departures</Text>
                  {departuresAll.map((d) => (
                    <Text key={d.id} style={styles.pkgItem}>
                      • {formatDate(d.startDate)}–{formatDate(d.endDate)} · {formatInr(departurePrice(pkg, d))}{" "}
                      {d.groupTrip ? "(Group)" : "(Private)"}
                    </Text>
                  ))}
                </View>

                <View style={styles.pkgBlock} wrap={false}>
                  <Text style={styles.pkgBlockTitle}>Highlights</Text>
                  {highlightsAll.map((h) => (
                    <Text key={h} style={styles.pkgItem}>
                      • {h}
                    </Text>
                  ))}
                </View>

                <View style={styles.pkgBlock} wrap={false}>
                  <Text style={styles.pkgBlockTitle}>Includes</Text>
                  {includesAll.map((i) => (
                    <Text key={i} style={styles.pkgItem}>
                      • {i}
                    </Text>
                  ))}
                </View>

                <View style={styles.pkgBlock} wrap={false}>
                  <Text style={styles.pkgBlockTitle}>Excludes</Text>
                  {excludesAll.map((i) => (
                    <Text key={i} style={styles.pkgItem}>
                      • {i}
                    </Text>
                  ))}
                </View>
              </View>
            </View>

            {/* Day-wise hierarchy as horizontal cards */}
            <Text style={styles.sectionTitle}>Day-wise itinerary (cards)</Text>
            <View style={styles.daysRow}>
              {itineraryDays.map((d) => (
                <View key={`${pkg.key}-card-${d.day}`} style={styles.dayCard} wrap={false}>
                  <Text style={styles.dayCardTitle}>
                    Day {d.day}: {d.title}
                  </Text>
                  {d.summary ? <Text style={styles.dayCardSummary}>{d.summary}</Text> : null}
                  {d.mealsIncluded?.length ? (
                    <Text style={styles.dayCardSummary}>Meals: {d.mealsIncluded.join(", ")}</Text>
                  ) : null}
                  {d.activities.map((a) => (
                    <Text key={`${pkg.key}-card-${d.day}-${a}`} style={styles.dayCardAct}>
                      • {a}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.rightCol}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Hotels</Text>
              {hotelsAll.map((h) => (
                <Text key={`${h.city}-${h.name}`} style={styles.pkgItem}>
                  • {h.name} — {h.city} ({h.nights}N){h.rating ? ` · ${h.rating}` : ""}
                </Text>
              ))}
            </View>

            <View style={styles.footer}>
              <Text style={styles.privacyOneLine}>
                {privacyOneLine}{" "}
                <Link src="https://www.raahexplorer.com/" style={{ color: brand.leaf }}>
                  https://www.raahexplorer.com/
                </Link>
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function downloadTripBrochurePdf(input: TripBrochureDocumentProps): Promise<void> {
  registerBrochureFonts();
  const blob = await pdf(<TripBrochureDocument {...input} />).toBlob();
  const safe = input.trip.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 72) || "trip";
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safe}-raah-explorer-brochure.pdf`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
