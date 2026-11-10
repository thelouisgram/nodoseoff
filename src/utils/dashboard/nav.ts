/** Shared dashboard nav helpers — keep tab ids stable, polish display labels. */

export function isDashboardTabActive(itemName: string, activeTab: string) {
  if (activeTab === itemName) return true;
  if (itemName === "AMANDA 6") {
    return activeTab === "AI" || activeTab === "AMANDA" || activeTab === "AMANDA 6";
  }
  return false;
}

export function dashboardTabLabel(name: string) {
  if (name === "AMANDA 6") return "Amanda";
  return name;
}
