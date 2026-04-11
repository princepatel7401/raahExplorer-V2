Raah Explorer — SAMPLE Google Sheet data (CSV import)
=====================================================

You cannot download a “live” Google Sheet from this project — Google hosts that in
your own Drive. The CSV files here are a ready-made sample: three trip types
(international, domestic, GROUP), two package tiers per trip, full day-wise rows,
sample departures, and HTTPS image URLs (Unsplash) so images work after import.

Trip categories (TripsMaster.category) — must be lowercase
-----------------------------------------------------------
These map to the three tabs on the site (“Trending Destinations”):

  international   → International Trips tab
  domestic        → Domestic Trips tab
  group           → Group Trips tab

Any other value falls back to international — use exactly one of the three words above.

Group trips vs TripDepartures.group_trip
----------------------------------------
- **category = group** puts the product under the **Group Trips** filter on the site.
- **TripDepartures** still has columns **group_trip** (true/false) and **seats_left**:
  use **true** + **seats_left** for fixed group departures; use **false** for a
  private date on a trip that is otherwise sold as “group” in marketing (rare).

Package keys for group products
-------------------------------
You can use **basic** / **premium**, or labels like **group_standard** /
**group_comfort** — any string, but the same **package_key** must repeat in
TripPackages, TripHotels, and TripItinerary for that trip. The sample group trip uses
**basic** = “Group Standard” and **premium** = “Group Comfort”.

Quick setup (about 5 minutes)
-----------------------------
1) Go to https://sheets.google.com → Blank spreadsheet.

2) Rename the file (top left), e.g. “Raah Explorer — Trips Sample”.

3) Create five tabs with EXACT names (right-click sheet tab → Rename):
   TripsMaster
   TripPackages
   TripHotels
   TripItinerary
   TripDepartures

4) For EACH tab:
   - Open the matching .csv from this folder on your computer.
   - Select all → Copy.
   - Click the matching empty tab in Google Sheets → cell A1 → Paste.
   (Or: File → Import → Upload the .csv → choose “Replace data in current sheet”
   after selecting the correct tab.)

5) Share: File → Share → General access → “Anyone with the link” → Viewer.

6) Copy the spreadsheet ID from the URL:
   https://docs.google.com/spreadsheets/d/<THIS_IS_THE_ID>/edit

7) In the project, create `.env.local`:
   VITE_GOOGLE_TRIPS_SPREADSHEET_ID=<paste_id_here>

8) Restart `npm run dev` and refresh the site — Trending Destinations loads from
   the sheet on each full page load.

What’s in the sample (3 trips)
------------------------------
- **int-bali-4n5d** — international (Bali).
- **dom-kashmir-4n5d** — domestic (Kashmir).
- **grp-manali-3n4d** — **group** (Manali fixed departure): category `group`, departures
  with group_trip=true and seats_left; Group Standard / Group Comfort packages.

- TripPackages: two tiers per trip with price_per_person_inr (INR).
- TripHotels: different hotels per package_key.
- TripItinerary: pipe-separated activities; group trip has 4 days × 2 packages.
- TripDepartures: price_override_inr optional for promos.

Replacing images with Google Drive
-----------------------------------
Swap `image_url` / `cover_image_url` / `gallery_urls` to your files, e.g.:
https://drive.google.com/uc?export=view&id=YOUR_FILE_ID
(File must be shared: Anyone with the link → Viewer.)

Lists in one cell
-----------------
Use pipe | between items (no commas inside one cell unless you quote the whole cell
in CSV).

Troubleshooting
---------------
- Tab names must match exactly (case-sensitive).
- Sheet must be shared so “Anyone with the link” can view.
- If the app shows an error, open the browser Network tab and confirm the gviz CSV
  URL loads for each tab name.
- Group trips missing on the site: check **category** is exactly **group** (no typo).
