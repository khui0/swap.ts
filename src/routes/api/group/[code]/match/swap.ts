export function swap(
  participants: string[],
  restricted: Set<string>,
): Record<string, string> | null {
  // Precompute allowed receivers per giver
  const allowed: Record<string, string[]> = {};
  for (const giver of participants) {
    allowed[giver] = participants.filter(
      (receiver) => receiver !== giver && !restricted.has(`${giver}->${receiver}`),
    );
    // If a giver has no allowed receivers, impossible immediately
    if (allowed[giver].length === 0) return null;
  }

  // Randomize order to reduce bias & increase success likelihood
  const randomOrder = [...participants].sort(() => Math.random() - 0.5);

  const used = new Set<string>();
  const assignment: Record<string, string> = {};

  function dfs(index: number): boolean {
    if (index === randomOrder.length) return true;

    const giver = randomOrder[index];

    // Shuffle allowed receivers for randomness
    const candidates = [...allowed[giver]].sort(() => Math.random() - 0.5);

    for (const receiver of candidates) {
      if (used.has(receiver)) continue;

      assignment[giver] = receiver;
      used.add(receiver);

      if (dfs(index + 1)) return true;

      delete assignment[giver];
      used.delete(receiver);
    }

    return false;
  }

  return dfs(0) ? assignment : null;
}
