import { useMemo, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import type {
  DestinationGroup,
  Trip,
  TripCategoryKey,
  TripDeparture,
  TripHotel,
  TripItineraryDay,
} from "../types/site";
import { destinationStartingPrice, fallbackDestinations } from "../data/tripsFallback";
import { AdminSelect, type AdminSelectOption } from "./AdminSelect";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD?.trim() || "raah-admin";

const CATEGORY_FILTER_OPTIONS: AdminSelectOption[] = [
  { value: "all", label: "All categories", hint: "Show every destination", tone: "all" },
  { value: "international", label: "International", hint: "Overseas", tone: "international" },
  { value: "domestic", label: "Domestic", hint: "India", tone: "domestic" },
  { value: "group", label: "Group", hint: "Fixed departures", tone: "group" },
];

const CATEGORY_EDIT_OPTIONS: AdminSelectOption[] = [
  { value: "international", label: "International", hint: "Overseas", tone: "international" },
  { value: "domestic", label: "Domestic", hint: "India", tone: "domestic" },
  { value: "group", label: "Group", hint: "Fixed departures", tone: "group" },
];

function emptyTrip(): Trip {
  return {
    id: `trip-${Date.now()}`,
    title: "New Trip",
    location: "",
    durationDays: 5,
    durationNights: 4,
    startingPricePerPersonInr: 0,
    coverImage: "",
    gallery: [],
    highlights: [],
    includes: [],
    excludes: [],
    defaultPackageKey: "basic",
    packages: [
      {
        key: "basic",
        label: "Standard",
        pricePerPersonInr: 0,
        hotels: [],
        itinerary: [],
      },
    ],
    departures: [],
  };
}

function emptyDestination(): DestinationGroup {
  return {
    id: `dest-${Date.now()}`,
    category: "international",
    title: "New Destination",
    location: "",
    coverImage: "",
    summary: "",
    trips: [emptyTrip()],
  };
}

function pipeJoin(items: string[]): string {
  return items.join(" | ");
}

function pipeSplit(s: string): string[] {
  return s
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}

function cloneDests(list: DestinationGroup[]): DestinationGroup[] {
  return JSON.parse(JSON.stringify(list)) as DestinationGroup[];
}

interface AdminPageProps {
  initialDestinations: DestinationGroup[];
  onDestinationsChange?: (destinations: DestinationGroup[]) => void;
}

export function AdminPage({ initialDestinations, onDestinationsChange }: AdminPageProps) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("raah-admin") === "1");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<DestinationGroup[]>(() =>
    cloneDests(initialDestinations.length ? initialDestinations : fallbackDestinations)
  );
  const [selectedDestId, setSelectedDestId] = useState<string | null>(
    () => (initialDestinations.length ? initialDestinations : fallbackDestinations)[0]?.id ?? null
  );
  const [selectedTripId, setSelectedTripId] = useState<string | null>(
    () => (initialDestinations.length ? initialDestinations : fallbackDestinations)[0]?.trips[0]?.id ?? null
  );
  const [status, setStatus] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | TripCategoryKey>("all");
  const [listView, setListView] = useState<"side" | "full">("side");
  const [checkedIds, setCheckedIds] = useState<Set<string>>(() => new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{ ids: string[] } | null>(null);

  const commit = (next: DestinationGroup[]) => {
    setDestinations(next);
    onDestinationsChange?.(cloneDests(next));
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return destinations.filter((d) => {
      if (categoryFilter !== "all" && d.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.trips.some((t) => t.title.toLowerCase().includes(q))
      );
    });
  }, [destinations, search, categoryFilter]);

  const selectedDest = useMemo(
    () => destinations.find((d) => d.id === selectedDestId) ?? destinations[0] ?? null,
    [destinations, selectedDestId]
  );

  const selectedTrip = useMemo(() => {
    if (!selectedDest) return null;
    return selectedDest.trips.find((t) => t.id === selectedTripId) ?? selectedDest.trips[0] ?? null;
  }, [selectedDest, selectedTripId]);

  const checkedCount = useMemo(() => {
    let n = 0;
    for (const d of filtered) if (checkedIds.has(d.id)) n += 1;
    return n;
  }, [filtered, checkedIds]);

  const allFilteredChecked = filtered.length > 0 && filtered.every((d) => checkedIds.has(d.id));

  const toggleChecked = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCheckAllFiltered = () => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredChecked) for (const d of filtered) next.delete(d.id);
      else for (const d of filtered) next.add(d.id);
      return next;
    });
  };

  const askDelete = (ids: string[]) => {
    if (!ids.length) return;
    setDeleteConfirm({ ids });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    const remove = new Set(deleteConfirm.ids);
    const next = destinations.filter((d) => !remove.has(d.id));
    commit(next);
    setSelectedDestId((cur) => {
      if (cur && remove.has(cur)) return next[0]?.id ?? null;
      return cur ?? next[0]?.id ?? null;
    });
    setSelectedTripId(next[0]?.trips[0]?.id ?? null);
    setCheckedIds((prev) => {
      const n = new Set(prev);
      for (const id of remove) n.delete(id);
      return n;
    });
    setStatus(remove.size === 1 ? "Destination deleted." : `Deleted ${remove.size} destinations.`);
    setDeleteConfirm(null);
  };

  const pendingDelete = useMemo(() => {
    if (!deleteConfirm) return [];
    const set = new Set(deleteConfirm.ids);
    return destinations.filter((d) => set.has(d.id));
  }, [deleteConfirm, destinations]);

  const login = (e: FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("raah-admin", "1");
      setAuthed(true);
      setAuthError(null);
    } else {
      setAuthError("Wrong password.");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("raah-admin");
    setAuthed(false);
    setPassword("");
  };

  const updateDest = (patch: Partial<DestinationGroup>) => {
    if (!selectedDest) return;
    commit(
      destinations.map((d) => (d.id === selectedDest.id ? { ...d, ...patch, trips: patch.trips ?? d.trips } : d))
    );
  };

  const updateTrip = (patch: Partial<Trip>) => {
    if (!selectedDest || !selectedTrip) return;
    commit(
      destinations.map((d) => {
        if (d.id !== selectedDest.id) return d;
        return {
          ...d,
          trips: d.trips.map((t) => {
            if (t.id !== selectedTrip.id) return t;
            const next = { ...t, ...patch };
            if (patch.startingPricePerPersonInr != null && next.packages[0]) {
              next.packages = [
                { ...next.packages[0], pricePerPersonInr: patch.startingPricePerPersonInr },
                ...next.packages.slice(1),
              ];
            }
            return next;
          }),
        };
      })
    );
  };

  const updatePackage = (patch: {
    label?: string;
    pricePerPersonInr?: number;
    hotels?: TripHotel[];
    itinerary?: TripItineraryDay[];
  }) => {
    if (!selectedDest || !selectedTrip) return;
    commit(
      destinations.map((d) => {
        if (d.id !== selectedDest.id) return d;
        return {
          ...d,
          trips: d.trips.map((t) => {
            if (t.id !== selectedTrip.id) return t;
            const pkg = t.packages[0] ?? {
              key: "basic",
              label: "Standard",
              pricePerPersonInr: 0,
              hotels: [],
              itinerary: [],
            };
            const nextPkg = { ...pkg, ...patch };
            return {
              ...t,
              startingPricePerPersonInr: nextPkg.pricePerPersonInr,
              packages: [nextPkg],
              defaultPackageKey: "basic",
            };
          }),
        };
      })
    );
  };

  const addDestination = () => {
    const d = emptyDestination();
    commit([...destinations, d]);
    setSelectedDestId(d.id);
    setSelectedTripId(d.trips[0]?.id ?? null);
    setSearch("");
    setCategoryFilter("all");
    setListView("side");
    setStatus("Destination added.");
  };

  const addTripToDest = () => {
    if (!selectedDest) return;
    const t = emptyTrip();
    t.location = selectedDest.location;
    commit(
      destinations.map((d) => (d.id === selectedDest.id ? { ...d, trips: [...d.trips, t] } : d))
    );
    setSelectedTripId(t.id);
    setStatus("Trip added under this destination.");
  };

  const removeTripFromDest = () => {
    if (!selectedDest || !selectedTrip) return;
    if (selectedDest.trips.length <= 1) {
      setStatus("Keep at least one trip, or delete the whole destination.");
      return;
    }
    if (!window.confirm(`Remove trip “${selectedTrip.title}”?`)) return;
    const nextTrips = selectedDest.trips.filter((t) => t.id !== selectedTrip.id);
    commit(
      destinations.map((d) => (d.id === selectedDest.id ? { ...d, trips: nextTrips } : d))
    );
    setSelectedTripId(nextTrips[0]?.id ?? null);
  };

  if (!authed) {
    return (
      <main className="admin-page admin-page--login" id="admin">
        <form className="admin-login" onSubmit={login}>
          <img src="/logo.png" alt="" width={64} height={64} />
          <h1>Destinations Admin</h1>
          <p className="admin-muted">Manage destination groups and their trips.</p>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {authError ? <p className="admin-error">{authError}</p> : null}
          <button type="submit" className="admin-btn admin-btn--primary">
            Enter
          </button>
          <a className="admin-back" href="#top">
            ← Back to site
          </a>
        </form>
      </main>
    );
  }

  const pkg = selectedTrip?.packages[0];

  return (
    <main className={`admin-page${listView === "full" ? " admin-page--list-full" : ""}`} id="admin">
      <header className="admin-top">
        <div>
          <h1>Destinations Admin</h1>
          <p className="admin-muted admin-top__sub">Groups (e.g. Thailand) with nested trips</p>
        </div>
        <div className="admin-top__actions">
          <button
            type="button"
            className={`admin-btn${listView === "full" ? " admin-btn--primary" : ""}`}
            onClick={() => setListView((v) => (v === "full" ? "side" : "full"))}
          >
            {listView === "full" ? "Edit view" : "Full listing"}
          </button>
          <button type="button" className="admin-btn admin-btn--ghost" onClick={logout}>
            Log out
          </button>
          <a className="admin-back" href="#top">
            View site
          </a>
        </div>
      </header>

      {status ? <p className="admin-status" role="status">{status}</p> : null}

      <div className="admin-layout">
        <aside className="admin-list">
          <div className="admin-list__toolbar">
            <div className="admin-list__head">
              <h2>Destinations</h2>
              <div className="admin-list__head-actions">
                {checkedCount > 0 ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger admin-btn--small"
                    onClick={() => askDelete(filtered.filter((d) => checkedIds.has(d.id)).map((d) => d.id))}
                  >
                    Delete ({checkedCount})
                  </button>
                ) : null}
                <button type="button" className="admin-btn admin-btn--small" onClick={addDestination}>
                  + Add
                </button>
              </div>
            </div>

            <div className="admin-list__filters">
              <input
                type="search"
                className="admin-list__search"
                placeholder="Search destination or trip…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search destinations"
              />
              <AdminSelect
                className="admin-list__category"
                value={categoryFilter}
                options={CATEGORY_FILTER_OPTIONS}
                ariaLabel="Filter by category"
                onChange={(v) => setCategoryFilter(v as "all" | TripCategoryKey)}
              />
            </div>

            <div className="admin-list__select-bar">
              <label className="admin-check admin-check--bar">
                <input
                  type="checkbox"
                  checked={allFilteredChecked}
                  disabled={filtered.length === 0}
                  onChange={toggleCheckAllFiltered}
                  aria-label="Select all visible destinations"
                />
                <span>Select all</span>
              </label>
              <p className="admin-list__count">
                {filtered.length} destination{filtered.length === 1 ? "" : "s"}
                {filtered.length !== destinations.length ? ` (of ${destinations.length})` : ""}
                {checkedCount > 0 ? ` · ${checkedCount} selected` : ""}
              </p>
            </div>
          </div>

          <div className="admin-list__scroll">
            {listView === "full" ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="admin-table__check">
                        <input
                          type="checkbox"
                          checked={allFilteredChecked}
                          disabled={filtered.length === 0}
                          onChange={toggleCheckAllFiltered}
                          aria-label="Select all visible destinations"
                        />
                      </th>
                      <th>Destination</th>
                      <th>Category</th>
                      <th>Trips</th>
                      <th>From</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="admin-list__empty">
                          No destinations match your search.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((d) => (
                        <tr
                          key={d.id}
                          className={`${d.id === selectedDest?.id ? "is-active" : ""}${checkedIds.has(d.id) ? " is-checked" : ""}`.trim() || undefined}
                        >
                          <td className="admin-table__check" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={checkedIds.has(d.id)}
                              onChange={() => toggleChecked(d.id)}
                              aria-label={`Select ${d.title}`}
                            />
                          </td>
                          <td
                            onClick={() => {
                              setSelectedDestId(d.id);
                              setSelectedTripId(d.trips[0]?.id ?? null);
                              setListView("side");
                            }}
                          >
                            <strong className="admin-list__name">{d.title || "Untitled"}</strong>
                            <div className="admin-list__loc">{d.location || "—"}</div>
                          </td>
                          <td>
                            <span className={`admin-list__cat admin-list__cat--${d.category}`}>{d.category}</span>
                          </td>
                          <td>{d.trips.length}</td>
                          <td>₹{destinationStartingPrice(d).toLocaleString("en-IN")}</td>
                          <td>
                            <button
                              type="button"
                              className="admin-btn admin-btn--small"
                              onClick={() => {
                                setSelectedDestId(d.id);
                                setSelectedTripId(d.trips[0]?.id ?? null);
                                setListView("side");
                              }}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <ul>
                {filtered.length === 0 ? (
                  <li className="admin-list__empty">No destinations match your search.</li>
                ) : (
                  filtered.map((d) => (
                    <li key={d.id} className="admin-list__row">
                      <label className="admin-check admin-check--row" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={checkedIds.has(d.id)}
                          onChange={() => toggleChecked(d.id)}
                          aria-label={`Select ${d.title}`}
                        />
                      </label>
                      <button
                        type="button"
                        className={`admin-list__item${d.id === selectedDest?.id ? " is-active" : ""}${checkedIds.has(d.id) ? " is-checked" : ""}`}
                        onClick={() => {
                          setSelectedDestId(d.id);
                          setSelectedTripId(d.trips[0]?.id ?? null);
                        }}
                      >
                        <strong className="admin-list__name">{d.title || "Untitled"}</strong>
                        <span className="admin-list__meta">
                          <span className={`admin-list__cat admin-list__cat--${d.category}`}>{d.category}</span>
                          <span>
                            {d.trips.length} trip{d.trips.length === 1 ? "" : "s"}
                          </span>
                        </span>
                        {d.location ? <span className="admin-list__loc">{d.location}</span> : null}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </aside>

        {listView === "side" ? (
          selectedDest && selectedTrip && pkg ? (
            <section className="admin-editor">
              <div className="admin-editor__head">
                <h2>Edit destination</h2>
                <button
                  type="button"
                  className="admin-btn admin-btn--danger admin-btn--small"
                  onClick={() => askDelete([selectedDest.id])}
                >
                  Delete destination
                </button>
              </div>

              <div className="admin-grid">
                <label>
                  Destination ID
                  <input value={selectedDest.id} readOnly disabled className="admin-input--readonly" />
                </label>
                <AdminSelect
                  label="Category"
                  value={selectedDest.category}
                  options={CATEGORY_EDIT_OPTIONS}
                  onChange={(v) => updateDest({ category: v as TripCategoryKey })}
                />
                <label className="admin-span-2">
                  Destination title
                  <input value={selectedDest.title} onChange={(e) => updateDest({ title: e.target.value })} />
                </label>
                <label className="admin-span-2">
                  Location
                  <input value={selectedDest.location} onChange={(e) => updateDest({ location: e.target.value })} />
                </label>
                <label className="admin-span-2">
                  Title image URL
                  <span className="admin-hint">Shown on the destination card and group modal.</span>
                  <input
                    value={selectedDest.coverImage}
                    onChange={(e) => updateDest({ coverImage: e.target.value })}
                    placeholder="https://… or /path/image.webp"
                  />
                </label>
                <label className="admin-span-2">
                  Summary
                  <textarea
                    rows={2}
                    value={selectedDest.summary ?? ""}
                    onChange={(e) => updateDest({ summary: e.target.value })}
                  />
                </label>
              </div>

              <div className="admin-block">
                <div className="admin-block__head">
                  <h3>Trips in {selectedDest.title || "destination"}</h3>
                  <button type="button" className="admin-btn admin-btn--small" onClick={addTripToDest}>
                    + Trip
                  </button>
                </div>
                <div
                  className="admin-trip-tabs"
                  role="tablist"
                  aria-label={`Trips in ${selectedDest.title || "destination"}`}
                >
                  {selectedDest.trips.map((t) => {
                    const selected = t.id === selectedTrip.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        role="tab"
                        id={`admin-trip-tab-${t.id}`}
                        aria-selected={selected}
                        aria-controls="admin-trip-panel"
                        className={`admin-trip-tab${selected ? " is-active" : ""}`}
                        onClick={() => setSelectedTripId(t.id)}
                      >
                        <span className="admin-trip-tab__title">{t.title || "Untitled trip"}</span>
                        <span className="admin-trip-tab__meta">
                          {t.durationDays}D/{t.durationNights}N · ₹
                          {t.startingPricePerPersonInr.toLocaleString("en-IN")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                className="admin-editor__head admin-editor__head--sub"
                id="admin-trip-panel"
                role="tabpanel"
                aria-labelledby={`admin-trip-tab-${selectedTrip.id}`}
              >
                <h2>Edit trip</h2>
                <button type="button" className="admin-btn admin-btn--danger admin-btn--small" onClick={removeTripFromDest}>
                  Remove trip
                </button>
              </div>

              <div className="admin-grid">
                <label>
                  Trip ID
                  <input value={selectedTrip.id} readOnly disabled className="admin-input--readonly" />
                </label>
                <label>
                  Price / person (₹)
                  <input
                    type="number"
                    min={0}
                    value={pkg.pricePerPersonInr}
                    onChange={(e) => updatePackage({ pricePerPersonInr: Number(e.target.value) || 0 })}
                  />
                </label>
                <label className="admin-span-2">
                  Trip title
                  <input value={selectedTrip.title} onChange={(e) => updateTrip({ title: e.target.value })} />
                </label>
                <label className="admin-span-2">
                  Trip location
                  <input value={selectedTrip.location} onChange={(e) => updateTrip({ location: e.target.value })} />
                </label>
                <label>
                  Days
                  <input
                    type="number"
                    min={1}
                    value={selectedTrip.durationDays}
                    onChange={(e) => updateTrip({ durationDays: Number(e.target.value) || 1 })}
                  />
                </label>
                <label>
                  Nights
                  <input
                    type="number"
                    min={0}
                    value={selectedTrip.durationNights}
                    onChange={(e) => updateTrip({ durationNights: Number(e.target.value) || 0 })}
                  />
                </label>
                <label>
                  Package label
                  <input value={pkg.label} onChange={(e) => updatePackage({ label: e.target.value })} />
                </label>
                <label className="admin-span-2">
                  Trip profile image URL
                  <span className="admin-hint">Card photo for this trip inside the destination.</span>
                  <input
                    value={selectedTrip.coverImage}
                    onChange={(e) => updateTrip({ coverImage: e.target.value })}
                    placeholder="https://… or /path/image.webp"
                  />
                </label>
                <label className="admin-span-2">
                  Gallery image URLs (separate with |)
                  <textarea
                    rows={2}
                    value={pipeJoin(selectedTrip.gallery)}
                    onChange={(e) => updateTrip({ gallery: pipeSplit(e.target.value) })}
                    placeholder="url1 | url2 | url3"
                  />
                </label>
                <label className="admin-span-2">
                  Highlights (|)
                  <textarea
                    rows={2}
                    value={pipeJoin(selectedTrip.highlights)}
                    onChange={(e) => updateTrip({ highlights: pipeSplit(e.target.value) })}
                  />
                </label>
                <label className="admin-span-2">
                  Includes (|)
                  <textarea
                    rows={2}
                    value={pipeJoin(selectedTrip.includes)}
                    onChange={(e) => updateTrip({ includes: pipeSplit(e.target.value) })}
                  />
                </label>
                <label className="admin-span-2">
                  Excludes (|)
                  <textarea
                    rows={2}
                    value={pipeJoin(selectedTrip.excludes)}
                    onChange={(e) => updateTrip({ excludes: pipeSplit(e.target.value) })}
                  />
                </label>
              </div>

              <HotelsEditor hotels={pkg.hotels} onChange={(hotels) => updatePackage({ hotels })} />
              <ItineraryEditor days={pkg.itinerary} onChange={(itinerary) => updatePackage({ itinerary })} />
              <DeparturesEditor
                deps={selectedTrip.departures}
                onChange={(departures) => updateTrip({ departures })}
              />
            </section>
          ) : (
            <section className="admin-editor">
              <p className="admin-muted">No destinations yet. Click Add to create one.</p>
            </section>
          )
        ) : null}
      </div>

      {deleteConfirm
        ? createPortal(
            <div
              className="admin-confirm"
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-confirm-title"
              onClick={(e) => {
                if (e.target === e.currentTarget) setDeleteConfirm(null);
              }}
            >
              <div className="admin-confirm__card">
                <h3 id="admin-confirm-title">
                  Delete{" "}
                  {pendingDelete.length === 1
                    ? "this destination"
                    : `${pendingDelete.length} destinations`}
                  ?
                </h3>
                <p className="admin-muted">All trips under the selected destinations will be removed.</p>
                <ul className="admin-confirm__list">
                  {pendingDelete.slice(0, 8).map((d) => (
                    <li key={d.id}>
                      <strong>{d.title || "Untitled"}</strong>
                      <span>
                        {d.trips.length} trip{d.trips.length === 1 ? "" : "s"}
                      </span>
                    </li>
                  ))}
                  {pendingDelete.length > 8 ? (
                    <li className="admin-confirm__more">+{pendingDelete.length - 8} more</li>
                  ) : null}
                </ul>
                <div className="admin-confirm__actions">
                  <button type="button" className="admin-btn" onClick={() => setDeleteConfirm(null)}>
                    Cancel
                  </button>
                  <button type="button" className="admin-btn admin-btn--danger" onClick={confirmDelete}>
                    Delete {pendingDelete.length > 1 ? `(${pendingDelete.length})` : ""}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </main>
  );
}

function HotelsEditor({
  hotels,
  onChange,
}: {
  hotels: TripHotel[];
  onChange: (h: TripHotel[]) => void;
}) {
  const update = (i: number, patch: Partial<TripHotel>) => {
    onChange(hotels.map((h, idx) => (idx === i ? { ...h, ...patch } : h)));
  };
  return (
    <div className="admin-block">
      <div className="admin-block__head">
        <h3>Hotels</h3>
        <button
          type="button"
          className="admin-btn admin-btn--small"
          onClick={() => onChange([...hotels, { city: "", name: "", nights: 1 }])}
        >
          + Hotel
        </button>
      </div>
      {hotels.map((h, i) => (
        <div className="admin-row" key={i}>
          <input placeholder="City" value={h.city} onChange={(e) => update(i, { city: e.target.value })} />
          <input placeholder="Hotel name" value={h.name} onChange={(e) => update(i, { name: e.target.value })} />
          <input
            type="number"
            min={1}
            placeholder="Nights"
            value={h.nights}
            onChange={(e) => update(i, { nights: Number(e.target.value) || 1 })}
          />
          <input placeholder="Rating" value={h.rating ?? ""} onChange={(e) => update(i, { rating: e.target.value })} />
          <button
            type="button"
            className="admin-btn admin-btn--ghost admin-btn--small"
            onClick={() => onChange(hotels.filter((_, j) => j !== i))}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function ItineraryEditor({
  days,
  onChange,
}: {
  days: TripItineraryDay[];
  onChange: (d: TripItineraryDay[]) => void;
}) {
  const update = (i: number, patch: Partial<TripItineraryDay>) => {
    onChange(days.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  };
  return (
    <div className="admin-block">
      <div className="admin-block__head">
        <h3>Day-wise itinerary</h3>
        <button
          type="button"
          className="admin-btn admin-btn--small"
          onClick={() =>
            onChange([
              ...days,
              {
                day: days.length + 1,
                title: "",
                summary: "",
                activities: [],
                mealsIncluded: [],
                image: "",
              },
            ])
          }
        >
          + Day
        </button>
      </div>
      {days.map((d, i) => (
        <div className="admin-day" key={i}>
          <div className="admin-row">
            <input
              type="number"
              min={1}
              value={d.day}
              onChange={(e) => update(i, { day: Number(e.target.value) || 1 })}
            />
            <input placeholder="Day title" value={d.title} onChange={(e) => update(i, { title: e.target.value })} />
            <button
              type="button"
              className="admin-btn admin-btn--ghost admin-btn--small"
              onClick={() => onChange(days.filter((_, j) => j !== i))}
            >
              Remove
            </button>
          </div>
          <textarea
            rows={2}
            placeholder="Summary"
            value={d.summary}
            onChange={(e) => update(i, { summary: e.target.value })}
          />
          <input
            placeholder="Activities (use ^ between items)"
            value={(d.activities ?? []).join("^")}
            onChange={(e) =>
              update(i, {
                activities: e.target.value
                  .split("^")
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
          />
          <input
            placeholder="Meals (use ^ between items)"
            value={(d.mealsIncluded ?? []).join("^")}
            onChange={(e) =>
              update(i, {
                mealsIncluded: e.target.value
                  .split("^")
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
          />
          <input
            placeholder="Day image URL (optional)"
            value={d.image}
            onChange={(e) => update(i, { image: e.target.value })}
          />
          <p className="admin-hint">Day-wise photo. Blank uses trip profile, or a designed Day card.</p>
        </div>
      ))}
    </div>
  );
}

function DeparturesEditor({
  deps,
  onChange,
}: {
  deps: TripDeparture[];
  onChange: (d: TripDeparture[]) => void;
}) {
  const update = (i: number, patch: Partial<TripDeparture>) => {
    onChange(deps.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  };
  return (
    <div className="admin-block">
      <div className="admin-block__head">
        <h3>Departures</h3>
        <button
          type="button"
          className="admin-btn admin-btn--small"
          onClick={() =>
            onChange([
              ...deps,
              {
                id: `dep-${Date.now()}`,
                startDate: "",
                endDate: "",
                groupTrip: false,
              },
            ])
          }
        >
          + Departure
        </button>
      </div>
      {deps.map((d, i) => (
        <div className="admin-row" key={d.id}>
          <input type="date" value={d.startDate} onChange={(e) => update(i, { startDate: e.target.value })} />
          <input type="date" value={d.endDate} onChange={(e) => update(i, { endDate: e.target.value })} />
          <label className="admin-check">
            <input
              type="checkbox"
              checked={d.groupTrip}
              onChange={(e) => update(i, { groupTrip: e.target.checked })}
            />
            Group
          </label>
          <input
            type="number"
            placeholder="Seats"
            value={d.seatsLeft ?? ""}
            onChange={(e) =>
              update(i, { seatsLeft: e.target.value === "" ? undefined : Number(e.target.value) })
            }
          />
          <input
            type="number"
            placeholder="Price override"
            value={d.pricePerPersonInr ?? ""}
            onChange={(e) =>
              update(i, {
                pricePerPersonInr: e.target.value === "" ? undefined : Number(e.target.value),
              })
            }
          />
          <button
            type="button"
            className="admin-btn admin-btn--ghost admin-btn--small"
            onClick={() => onChange(deps.filter((_, j) => j !== i))}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
