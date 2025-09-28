import osUtils from 'os-utils';
import disk from 'diskusage';
import os from 'os';

const POLLING_INTERVAL = 500; // 2 times per second

export function pollResources(){
    setInterval(async () => {
        const cpuUsage = await getCpuUsage();
        console.log('CPU Usage (%): ', (cpuUsage * 100).toFixed(2));
        const ramUsage = getRamUsage();
        console.log('RAM Usage (%): ', (ramUsage * 100).toFixed(2));
        const storageUsage = getStorageUsage();
        console.log('Storage Usage (%): ', (storageUsage.usage * 100).toFixed(2));
    }, POLLING_INTERVAL);
};

export function getStaticData() {
    const totalStorage = getStorageUsage().total;
    const cpuModel = os.cpus()[0].model;
    const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024);

    return {
        totalStorage,
        cpuModel,
        totalMemoryGB,
    }
};

function getCpuUsage(): Promise<number> {
    return new Promise<number>(resolve => {
        osUtils.cpuUsage(resolve);
    });
};

function getRamUsage(): number { 
    return 1 - (osUtils.freememPercentage());
};
function getStorageUsage() {
    // Use 'diskusage' to get disk space info
    const path = process.platform === 'win32' ? 'C:\\' : '/';
    const { total, free } = disk.checkSync(path);
    
    return {
        total : Math.floor(total / 1_000_000_000), // in GB
        usage : 1 - free/total,
    };
};