const initialQueue = [
  { id: 1, name: 'TT&C / Housekeeping', mode: 'TT&C', size: 12, priority: 'Critical' },
  { id: 2, name: 'M17 Digital Comms', mode: 'M17', size: 25, priority: 'High' },
  { id: 3, name: 'Codec2 Voice', mode: 'Codec2', size: 40, priority: 'Medium' },
  { id: 4, name: 'SSTV Image', mode: 'SSTV', size: 180, priority: 'Low' },
];

export function getInitialTelemetry() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        battery: 70,
        linkQuality: 'Good',
        availableTime: 5,
        queue: [...initialQueue],
        updatedAt: new Date().toLocaleTimeString(),
      });
    }, 200);
  });
}

export function runAiScheduler({ battery, linkQuality, availableTime, queue }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rates = { Good: 1.2, Fair: 0.6, Poor: 0.15 };
      const rate = rates[linkQuality] || 1.2;
      const totalSec = availableTime * 60;
      const priorityWeights = { Critical: 4, High: 3, Medium: 2, Low: 1 };

      let usedSec = 0;

      const decisions = queue.map((item) => {
        const itemSec = Math.round(item.size / rate);
        let transmit = true;

        if (battery < 15) {
          transmit = item.priority === 'Critical';
        } else if (battery <= 30) {
          transmit = item.priority === 'Critical' || item.priority === 'High';
        } else if (linkQuality === 'Poor') {
          transmit = item.mode !== 'SSTV' && item.size <= 100;
        }

        if (transmit) {
          if (usedSec + itemSec > totalSec) {
            transmit = false;
          } else {
            usedSec += itemSec;
          }
        }

        return { id: item.id, status: transmit ? 'Transmit' : 'Defer', timeSec: itemSec };
      });

      const approved = queue
        .filter((item) => decisions.find((d) => d.id === item.id)?.status === 'Transmit')
        .sort((a, b) => (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0));

      let nextItem = 'None (Standby)';
      let mode = 'Standby';
      let priority = 'None';
      let confidence = '85%';
      let reason = 'Insufficient power or time for pending payloads.';

      if (approved.length > 0) {
        const top = approved[0];
        nextItem = top.name;
        mode = top.mode;
        priority = top.priority;

        if (battery > 50 && linkQuality === 'Good') {
          confidence = '95%';
        } else if (battery < 20 || linkQuality === 'Poor') {
          confidence = '70%';
        }

        if (battery < 15) {
          reason = `Critical battery (${battery}%): non-essential data deferred, prioritizing ${top.name}.`;
        } else if (battery <= 30) {
          reason = `Power-save mode (${battery}%): prioritizing ${top.name} over heavier media payloads.`;
        } else if (linkQuality === 'Poor') {
          reason = `Poor link quality: scheduling lightweight digital mode (${top.name}) for link stability.`;
        } else if (availableTime < 2) {
          reason = `Short pass window (${availableTime}m): downlink of ${top.name} prioritized before pass ends.`;
        } else {
          reason = `Nominal conditions (${battery}% battery, ${linkQuality} link): ${top.name} scheduled by priority.`;
        }
      }

      resolve({
        nextItem,
        mode,
        priority,
        confidence,
        reason,
        decisions,
        updatedAt: new Date().toLocaleTimeString(),
      });
    }, 150);
  });
}
