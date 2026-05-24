// Striped Bass scoring — weights total 100 with optional zone modifier.

export function scoreStriper(c) {
  const factors = [];
  let total = 0;

  // Water temp (20 pts)
  const wt = c.waterTemp;
  let waterPts;
  if (wt >= 55 && wt <= 68) waterPts = 20;
  else if (wt > 68 && wt <= 72) waterPts = 14;
  else if (wt > 72 && wt <= 78) waterPts = 8;
  else if (wt > 78) waterPts = 3;
  else waterPts = 5; // < 50 falls here too
  factors.push({ name: 'Water Temp', pts: waterPts, max: 20, pill: pillFor(waterPts, 20) });
  total += waterPts;

  // Barometric pressure (18 pts)
  let baroPts;
  if (c.baroTrend === 'stable' && c.pressure >= 1018) baroPts = 18;
  else if (c.baroTrend === 'stable') baroPts = 15;
  else if (c.baroTrend === 'rising') baroPts = 14;
  else if (c.baroTrend === 'falling' && c.baroRate < -1) baroPts = 3;
  else baroPts = 8; // falling normal
  factors.push({ name: 'Baro Trend', pts: baroPts, max: 18, pill: pillFor(baroPts, 18) });
  total += baroPts;

  // Time of day (18 pts)
  let todPts;
  if (c.isDawnWindow || c.isDuskWindow) todPts = 18;
  else if (c.isNight && c.moonIllumination >= 90) todPts = 15;
  else if (c.isNight) todPts = 8;
  else todPts = 5;
  factors.push({ name: 'Time of Day', pts: todPts, max: 18, pill: pillFor(todPts, 18) });
  total += todPts;

  // Solunar (15 pts)
  let solPts;
  if (c.solunar === 'major') solPts = 15;
  else if (c.solunar === 'minor') solPts = 9;
  else solPts = 0;
  factors.push({ name: 'Solunar', pts: solPts, max: 15, pill: pillFor(solPts, 15) });
  total += solPts;

  // Moon phase (12 pts)
  let moonPts;
  if (c.moonPhase === 'Full Moon' || c.moonPhase === 'New Moon') moonPts = 12;
  else if (c.moonPhase === 'First Quarter' || c.moonPhase === 'Last Quarter') moonPts = 7;
  else moonPts = 4;
  factors.push({ name: 'Moon Phase', pts: moonPts, max: 12, pill: pillFor(moonPts, 12) });
  total += moonPts;

  // Wind (10 pts)
  const w = c.wind;
  let windPts;
  if (w >= 10 && w <= 15) windPts = 10;
  else if (w >= 5 && w < 10) windPts = 7;
  else if (w < 5) windPts = 5;
  else if (w > 20) windPts = 2;
  else windPts = 6;
  factors.push({ name: 'Wind', pts: windPts, max: 10, pill: pillFor(windPts, 10) });
  total += windPts;

  // Inflow / turbidity (7 pts)
  let inflowPts;
  switch (c.inflowClass) {
    case 'Normal': inflowPts = 7; break;
    case 'Very Low': inflowPts = 4; break;
    case 'High': inflowPts = 3; break;
    case 'Flood/Turbid': inflowPts = 1; break;
    default: inflowPts = 4;
  }
  factors.push({ name: 'Inflow', pts: inflowPts, max: 7, pill: pillFor(inflowPts, 7) });
  total += inflowPts;

  // Zone modifier: stripers thermocline-locked in upper-lake heat
  let modifier = 0;
  if (c.zone === 'upper' && wt > 76) {
    modifier = -12;
    factors.push({ name: 'Upper-lake heat penalty', pts: -12, max: 0, pill: 'Unfavorable' });
  }

  const score = clamp(total + modifier);
  return finalize(score, factors, verdictStriper(score, c));
}

function verdictStriper(score, c) {
  if (score >= 76) return 'Stripers actively chasing — top-water and main-lake humps in play.';
  if (score >= 56) return 'Solid bite window — work points, brush piles, and bait schools on sonar.';
  if (score >= 31) return 'Selective feeders — downline live bait or slow trolling deep is your best shot.';
  return 'Tough day — fish deep, slow, and expect short windows. Patience and electronics win.';
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
