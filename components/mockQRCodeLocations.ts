interface Location {
  batchId: string;
  lat: number;
  lng: number;
  time: string;
  reward: number;
  status: 'Active' | 'Claimed';
}

interface CumulativeDataPoint {
  date: string;
  Active: number;
  Claimed: number;
  ProjectedActive?: number;
  ProjectedClaimed?: number;
}

function generateUSACoordinates(): Omit<Location, 'time' | 'status'> {
  const regions = [
    { name: 'Northeast', minLat: 40, maxLat: 47, minLng: -80, maxLng: -70, weight: 0.3 },
    { name: 'Southeast', minLat: 25, maxLat: 35, minLng: -90, maxLng: -75, weight: 0.2 },
    { name: 'Midwest', minLat: 36, maxLat: 49, minLng: -97, maxLng: -80, weight: 0.2 },
    { name: 'West Coast', minLat: 32, maxLat: 49, minLng: -124, maxLng: -110, weight: 0.2 },
    { name: 'Other', minLat: 24, maxLat: 49, minLng: -125, maxLng: -66, weight: 0.1 }
  ];

  const randomRegion = Math.random();
  let selectedRegion = regions[regions.length - 1];

  let cumulativeWeight = 0;
  for (const region of regions) {
    cumulativeWeight += region.weight;
    if (randomRegion <= cumulativeWeight) {
      selectedRegion = region;
      break;
    }
  }

  const lat = selectedRegion.minLat + Math.random() * (selectedRegion.maxLat - selectedRegion.minLat);
  const lng = selectedRegion.minLng + Math.random() * (selectedRegion.maxLng - selectedRegion.minLng);

  // Generate a random reward amount between 100 and 10000 satoshis
  const reward = Math.floor(Math.random() * (10000 - 100 + 1) + 100);

  return {
    batchId: '', // This will be set in the generateQRCodes function
    lat,
    lng,
    reward,
  };
}

function generateStochasticClaimTimes(totalQRCodes: number, daysCount: number, claimPercentage: number): Date[] {
  const now = new Date();
  const startDate = new Date(now.getTime() - daysCount * 24 * 60 * 60 * 1000);
  
  const targetClaimCount = Math.floor(totalQRCodes * claimPercentage);
  
  const claimTimes: Date[] = [];
  let remainingClaims = targetClaimCount;
  
  // Generate a random "excitement factor" for each day with higher variance
  const dailyExcitement = Array(daysCount).fill(0).map(() => Math.random() * 1.5 + 0.5);
  
  for (let day = 0; day < daysCount; day++) {
    // Base daily claim rate now varies between 0.5% and 10%
    const baseDailyClaimRate = Math.random() * 0.095 + 0.005;
    
    // Adjust claim rate based on excitement factor and a random boost
    const adjustedClaimRate = baseDailyClaimRate * dailyExcitement[day] * (Math.random() * 0.5 + 0.75);
    
    let dailyClaims = Math.floor(remainingClaims * adjustedClaimRate);
    
    // Add some extra randomness to daily claims
    dailyClaims += Math.floor(Math.random() * 20) - 10;
    
    // Ensure we don't go negative or exceed the remaining claims
    dailyClaims = Math.max(0, Math.min(dailyClaims, remainingClaims));
    
    for (let i = 0; i < dailyClaims; i++) {
      const randomTime = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000 + Math.random() * 24 * 60 * 60 * 1000);
      claimTimes.push(randomTime);
    }
    
    remainingClaims -= dailyClaims;
    if (remainingClaims <= 0) break;
  }
  
  // Distribute any remaining claims across the last few days
  if (remainingClaims > 0) {
    const lastFewDays = 5;
    for (let i = 0; i < remainingClaims; i++) {
      const randomDay = daysCount - Math.floor(Math.random() * lastFewDays) - 1;
      const randomTime = new Date(startDate.getTime() + randomDay * 24 * 60 * 60 * 1000 + Math.random() * 24 * 60 * 60 * 1000);
      claimTimes.push(randomTime);
    }
  }
  
  return claimTimes.sort((a, b) => a.getTime() - b.getTime());
}

function generateQRCodes(total: number): { locations: Location[], cumulativeData: CumulativeDataPoint[] } {
  const qrCodes: Location[] = [];
  const claimPercentage = 0.75; // 75% of QR codes will be claimed
  const daysCount = 30;
  const claimTimes = generateStochasticClaimTimes(total, daysCount, claimPercentage);
  const totalClaimedCodes = claimTimes.length;

  console.log(`Total QR Codes: ${total}`);
  console.log(`Target Claimed Codes: ${totalClaimedCodes}`);

  // Generate batch IDs (for this example, we'll create 3 batches)
  const batchIds = ['Batch001', 'Batch002', 'Batch003'];

  // Generate all QR codes first
  for (let i = 0; i < total; i++) {
    const coordinates = generateUSACoordinates();
    qrCodes.push({
      ...coordinates,
      batchId: batchIds[i % batchIds.length], // Assign batch IDs in a round-robin fashion
      time: '',
      status: 'Active'
    });
  }

  // Assign claim times to QR codes
  for (let i = 0; i < totalClaimedCodes; i++) {
    qrCodes[i].status = 'Claimed';
    qrCodes[i].time = claimTimes[i].toISOString();
  }

  // Shuffle the array to randomize the order of claimed and unclaimed codes
  for (let i = qrCodes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [qrCodes[i], qrCodes[j]] = [qrCodes[j], qrCodes[i]];
  }

  // Generate cumulative data
  const cumulativeData: CumulativeDataPoint[] = [];
  const startDate = new Date(new Date().getTime() - daysCount * 24 * 60 * 60 * 1000);
  let claimedCount = 0;

  for (let i = 0; i <= daysCount; i++) {
    const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    
    while (claimedCount < totalClaimedCodes && new Date(claimTimes[claimedCount]) <= currentDate) {
      claimedCount++;
    }

    cumulativeData.push({
      date: currentDate.toISOString().split('T')[0],
      Active: total - claimedCount,
      Claimed: claimedCount
    });
  }

  const actualClaimedCodes = qrCodes.filter(qr => qr.status === 'Claimed').length;
  console.log(`Actual Claimed Codes: ${actualClaimedCodes}`);
  console.log(`Claim Percentage: ${(actualClaimedCodes / total * 100).toFixed(2)}%`);

  return { locations: qrCodes, cumulativeData };
}

const { locations: mockQRCodeLocations, cumulativeData } = generateQRCodes(10000);

// Sort the data by time for claimed QR codes
mockQRCodeLocations.sort((a, b) => {
  if (a.status === 'Claimed' && b.status === 'Claimed') {
    return new Date(a.time).getTime() - new Date(b.time).getTime();
  }
  return 0;
});

console.log('Cumulative Data:', cumulativeData);

const finalClaimedCount = mockQRCodeLocations.filter(qr => qr.status === 'Claimed').length;
console.log(`Final Claimed Count: ${finalClaimedCount}`);
console.log(`Final Claim Percentage: ${(finalClaimedCount / mockQRCodeLocations.length * 100).toFixed(2)}%`);

export { mockQRCodeLocations, cumulativeData };
export type { Location, CumulativeDataPoint };