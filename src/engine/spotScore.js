// Spotted Bass scoring.

export function scoreSpot(c) {
  const factors = [];
  let total = 0;

  // Water temp (18 pts)
  const wt = c.waterTemp;
  let waterPts;
  if (wt >= 62 && wt <= 72) waterPts = 18;
  else if (wt >= 55 && wt < 62) waterPts = 12;
  else if (wt > 72 && wt <= 78) waterPts = 10;
  else if (wt > 78) waterPts = 5;
  else waterPts = 4;
  factors.push({ name: 'Water Temp', pts: waterPts, max: 18, pill: pillFor(waterPts, 18) });
  total += waterPts;

  // Barometric pressure (20 pts)
  let baroPts;
  if (c.baroTrend === 'stable') baroPts = 20;
  else if (c.baroTrend === 'rising' && c.baroRate < 1) baroPts = 16;
  else if (c.baroTrend === 'rising') baroPts = 14;
  else if (c.baroTrend === 'falling' && c.baroRate < -1) baroPts = 4;
  else baroPts = 10;
  factors.push({ name: 'Baro Trend', pts: baroPts, max: 20, pill: pillFor(baroPts, 20) });
  total += baroPts;

  // Time of day (20 pts)
  let todPts;
  if (c.isDawnWindow) todPts = 20;
  else if (c.isDuskWindow) todPts = 17;
  else if (c.isNight) todPts = 8;
  else todPts = 6;
  factors.push({ name: 'Time of Day', pts: todPts, max: 20, pill: pillFor(todPts, 20) });
  total += todPts;

  // Solunar (12 pts)
  let solPts;
  if (c.solunar === 'major') solPts = 12;
  else if (c.solunar === 'minor') solPts = 7;
  else solPts = 0;
  factors.push({ name: 'Solunar', pts: solPts, max: 12, pill: pillFor(solPts, 12) });
  total += solPts;

  // Cloud cover (12 pts)
  let cloudPts;
  if (c.clouds > 75) cloudPts = 12;
  else if (c.clouds >= 30) cloudPts = 9;
  else cloudPts = 5;
  factors.push({ name: 'Cloud Cover', pts: cloudPts, max: 12, pill: pillFor(cloudPts, 12) });
  total += cloudPts;

  // Wind (10 pts)
  const w = c.wind;
  let windPts;
  if (w >= 8 && w <= 15) windPts = 10;
  else if (w >= 5 && w < 8) windPts = 7;
  else if (w < 5) windPts = 6;
  else if (w > 20) windPts = 3;
  else windPts = 7;
  factors.push({ name: 'Wind', pts: windPts, max: 10, pill: pillFor(windPts, 10) });
  total += windPts;

  // Moon phase (8 pts)
  let moonPts;
  if (c.moonPhase === 'Full Moon' || c.moonPhase === 'New Moon') moonPts = 8;
  else if (c.moonPhase === 'First Quarter' || c.moonPhase === 'Last Quarter') moonPts = 5;
  else moonPts = 3;
  factors.push({ name: 'Moon Phase', pts: moonPts, max: 8, pill: pillFor(moonPts, 8) });
  total += moonPts;

  // Light rain modifier
  let modifier = 0;
  if (c.precip >= 0.05 && c.precip <= 0.20) {
    modifier = 8;
    factors.push({ name: 'Light rain bonus', pts: 8, max: 8, pill: 'Favorable' });
  }

  const score = clamp(total + modifier);
  return finalize(score, factors, verdictSpot(score, c));
}

function verdictSpot(score, c) {
  if (score >= 76) return 'Spots feeding aggressively near structure — fish moving baitfish.';
  if (score >= 56) return 'Solid bite — work rocky points, brush, and channel-swing banks.';
  if (score >= 31) return 'Bite is selective — drop shot or finesse jigs on deep structure.';
  return 'Tough conditions — go small, slow, and vertical on deep brush.';
}

function pillFor(pts, max) {
  if (max === 0) return 'Unfavorable';
  const r = pts / max;
  if (r >= 0.66) return 'Favorable';
  if (r >= 0.34) return 'Neutral';
  return 'Unfavorable';
}

function clamp(n) { return Math.max(0, Math.min(100, Math.round(n))); }

function finalize(score, factors, verdict) {
  let label, color;
  if (score >= 76) { label = 'Excellent'; color = '#22c55e'; }
  else if (score >= 56) { label = 'Good'; color = '#3b82f6'; }
  else if (score >= 31) { label = 'Fair'; color = '#f59e0b'; }
  else { label = 'Tough'; color = '#ef4444'; }
  return { score, label, color, verdict, factors };
}
