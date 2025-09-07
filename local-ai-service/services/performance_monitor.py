"""
Performance Monitor Service
Handles system performance monitoring and metrics collection
"""

import asyncio
import time
import logging
import psutil
import threading
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime

logger = logging.getLogger(__name__)

@dataclass
class PerformanceMetrics:
    """Data class for performance metrics"""
    timestamp: datetime
    cpu_percent: float
    cpu_count: int
    cpu_freq_current: float
    memory_percent: float
    memory_total: int
    memory_used: int
    memory_available: int
    disk_total: int
    disk_used: int
    disk_free: int
    disk_percent: float
    network_bytes_sent: int
    network_bytes_recv: int
    network_packets_sent: int
    network_packets_recv: int
    boot_time: datetime
    process_count: int

class PerformanceMonitor:
    """Handles system performance monitoring"""

    def __init__(self):
        self.metrics_history: List[PerformanceMetrics] = []
        self.max_history_size = 1000
        self.monitoring = False
        self.monitor_thread = None
        self.last_network_stats = None

        logger.info("PerformanceMonitor initialized")

    def get_current_metrics(self) -> PerformanceMetrics:
        """Get current system performance metrics"""
        try:
            # CPU metrics
            cpu_percent = psutil.cpu_percent(interval=1)
            cpu_count = psutil.cpu_count()
            cpu_freq = psutil.cpu_freq()
            cpu_freq_current = cpu_freq.current if cpu_freq else 0.0

            # Memory metrics
            memory = psutil.virtual_memory()
            memory_percent = memory.percent
            memory_total = memory.total
            memory_used = memory.used
            memory_available = memory.available

            # Disk metrics
            disk = psutil.disk_usage('/')
            disk_total = disk.total
            disk_used = disk.used
            disk_free = disk.free
            disk_percent = disk.percent

            # Network metrics
            net_io = psutil.net_io_counters()
            network_bytes_sent = net_io.bytes_sent
            network_bytes_recv = net_io.bytes_recv
            network_packets_sent = net_io.packets_sent
            network_packets_recv = net_io.packets_recv

            # System info
            boot_time = datetime.fromtimestamp(psutil.boot_time())
            process_count = len(psutil.pids())

            return PerformanceMetrics(
                timestamp=datetime.now(),
                cpu_percent=cpu_percent,
                cpu_count=cpu_count,
                cpu_freq_current=cpu_freq_current,
                memory_percent=memory_percent,
                memory_total=memory_total,
                memory_used=memory_used,
                memory_available=memory_available,
                disk_total=disk_total,
                disk_used=disk_used,
                disk_free=disk_free,
                disk_percent=disk_percent,
                network_bytes_sent=network_bytes_sent,
                network_bytes_recv=network_bytes_recv,
                network_packets_sent=network_packets_sent,
                network_packets_recv=network_packets_recv,
                boot_time=boot_time,
                process_count=process_count
            )

        except Exception as e:
            logger.error(f"Error collecting performance metrics: {e}")
            # Return default metrics on error
            return PerformanceMetrics(
                timestamp=datetime.now(),
                cpu_percent=0.0,
                cpu_count=0,
                cpu_freq_current=0.0,
                memory_percent=0.0,
                memory_total=0,
                memory_used=0,
                memory_available=0,
                disk_total=0,
                disk_used=0,
                disk_free=0,
                disk_percent=0.0,
                network_bytes_sent=0,
                network_bytes_recv=0,
                network_packets_sent=0,
                network_packets_recv=0,
                boot_time=datetime.now(),
                process_count=0
            )

    def get_system_resources(self) -> Dict[str, Any]:
        """Get system resource information"""
        try:
            metrics = self.get_current_metrics()

            # CPU information
            cpu_info = {
                "cpu_usage": metrics.cpu_percent,
                "cpu_cores": metrics.cpu_count,
                "cpu_frequency": metrics.cpu_freq_current,
                "cpu_temperature": self._get_cpu_temperature()
            }

            # Memory information
            memory_info = {
                "memory_total": metrics.memory_total,
                "memory_used": metrics.memory_used,
                "memory_available": metrics.memory_available,
                "memory_percent": metrics.memory_percent
            }

            # Disk information
            disk_info = {
                "disk_total": metrics.disk_total,
                "disk_used": metrics.disk_used,
                "disk_free": metrics.disk_free,
                "disk_percent": metrics.disk_percent
            }

            # GPU information (if available)
            gpu_info = self._get_gpu_info()

            # Network information
            network_info = {
                "bytes_sent": metrics.network_bytes_sent,
                "bytes_recv": metrics.network_bytes_recv,
                "packets_sent": metrics.network_packets_sent,
                "packets_recv": metrics.network_packets_recv
            }

            return {
                "cpu": cpu_info,
                "memory": memory_info,
                "disk": disk_info,
                "gpu": gpu_info,
                "network": network_info,
                "system": {
                    "boot_time": metrics.boot_time.isoformat(),
                    "process_count": metrics.process_count,
                    "uptime_seconds": (datetime.now() - metrics.boot_time).total_seconds()
                }
            }

        except Exception as e:
            logger.error(f"Error getting system resources: {e}")
            return {}

    def _get_cpu_temperature(self) -> Optional[float]:
        """Get CPU temperature if available"""
        try:
            # Try to get CPU temperature from different sources
            if hasattr(psutil, 'sensors_temperatures'):
                temps = psutil.sensors_temperatures()
                for name, entries in temps.items():
                    if 'core' in name.lower() or 'cpu' in name.lower():
                        for entry in entries:
                            if hasattr(entry, 'current'):
                                return entry.current

            # Try alternative methods for different systems
            import os
            if os.path.exists('/sys/class/thermal/thermal_zone0/temp'):
                with open('/sys/class/thermal/thermal_zone0/temp', 'r') as f:
                    return float(f.read().strip()) / 1000.0

            return None

        except Exception:
            return None

    def _get_gpu_info(self) -> List[Dict[str, Any]]:
        """Get GPU information if available"""
        gpu_info = []

        try:
            # Try nvidia-ml-py for NVIDIA GPUs
            try:
                import pynvml
                pynvml.nvmlInit()
                device_count = pynvml.nvmlDeviceGetCount()

                for i in range(device_count):
                    handle = pynvml.nvmlDeviceGetHandleByIndex(i)
                    name = pynvml.nvmlDeviceGetName(handle).decode('utf-8')

                    # Get memory info
                    memory_info = pynvml.nvmlDeviceGetMemoryInfo(handle)

                    # Get utilization
                    utilization = pynvml.nvmlDeviceGetUtilizationRates(handle)

                    gpu_info.append({
                        "id": i,
                        "name": name,
                        "memory_total": memory_info.total,
                        "memory_used": memory_info.used,
                        "memory_free": memory_info.free,
                        "gpu_utilization": utilization.gpu,
                        "memory_utilization": utilization.memory
                    })

                pynvml.nvmlShutdown()

            except ImportError:
                pass

            # Try AMD GPUs via sysfs
            import os
            gpu_path = '/sys/class/drm/card0/device'
            if os.path.exists(gpu_path):
                try:
                    with open(f'{gpu_path}/gpu_busy_percent', 'r') as f:
                        gpu_util = float(f.read().strip())

                    with open(f'{gpu_path}/mem_info_vram_total', 'r') as f:
                        vram_total = int(f.read().strip())

                    with open(f'{gpu_path}/mem_info_vram_used', 'r') as f:
                        vram_used = int(f.read().strip())

                    gpu_info.append({
                        "id": 0,
                        "name": "AMD GPU",
                        "memory_total": vram_total,
                        "memory_used": vram_used,
                        "memory_free": vram_total - vram_used,
                        "gpu_utilization": gpu_util,
                        "memory_utilization": (vram_used / vram_total) * 100 if vram_total > 0 else 0
                    })

                except Exception:
                    pass

        except Exception as e:
            logger.warning(f"Error getting GPU info: {e}")

        return gpu_info

    def start_monitoring(self, interval: float = 5.0):
        """Start continuous performance monitoring"""
        if self.monitoring:
            logger.warning("Performance monitoring is already running")
            return

        self.monitoring = True
        self.monitor_thread = threading.Thread(
            target=self._monitoring_loop,
            args=(interval,),
            daemon=True
        )
        self.monitor_thread.start()
        logger.info(f"Started performance monitoring with {interval}s interval")

    def stop_monitoring(self):
        """Stop continuous performance monitoring"""
        if not self.monitoring:
            logger.warning("Performance monitoring is not running")
            return

        self.monitoring = False
        if self.monitor_thread:
            self.monitor_thread.join(timeout=5)

        logger.info("Stopped performance monitoring")

    def _monitoring_loop(self, interval: float):
        """Internal monitoring loop"""
        while self.monitoring:
            try:
                metrics = self.get_current_metrics()
                self.metrics_history.append(metrics)

                # Keep history size limited
                if len(self.metrics_history) > self.max_history_size:
                    self.metrics_history = self.metrics_history[-self.max_history_size:]

                logger.debug(f"Collected performance metrics: CPU={metrics.cpu_percent}%, Memory={metrics.memory_percent}%")

                time.sleep(interval)

            except Exception as e:
                logger.error(f"Error in monitoring loop: {e}")
                time.sleep(interval)

    def get_metrics_history(self, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Get historical metrics as dictionaries"""
        history = self.metrics_history
        if limit:
            history = history[-limit:]

        return [
            {
                "timestamp": metric.timestamp.isoformat(),
                "cpu_percent": metric.cpu_percent,
                "memory_percent": metric.memory_percent,
                "disk_percent": metric.disk_percent,
                "network_bytes_sent": metric.network_bytes_sent,
                "network_bytes_recv": metric.network_bytes_recv,
                "process_count": metric.process_count
            }
            for metric in history
        ]

    def get_average_metrics(self, duration_minutes: int = 60) -> Dict[str, float]:
        """Get average metrics over the specified duration"""
        cutoff_time = datetime.now() - timedelta(minutes=duration_minutes)

        relevant_metrics = [
            metric for metric in self.metrics_history
            if metric.timestamp >= cutoff_time
        ]

        if not relevant_metrics:
            return {}

        return {
            "avg_cpu_percent": sum(m.cpu_percent for m in relevant_metrics) / len(relevant_metrics),
            "avg_memory_percent": sum(m.memory_percent for m in relevant_metrics) / len(relevant_metrics),
            "avg_disk_percent": sum(m.disk_percent for m in relevant_metrics) / len(relevant_metrics),
            "avg_network_bytes_sent_per_sec": sum(m.network_bytes_sent for m in relevant_metrics) / (duration_minutes * 60),
            "avg_network_bytes_recv_per_sec": sum(m.network_bytes_recv for m in relevant_metrics) / (duration_minutes * 60)
        }

    def get_performance_summary(self) -> Dict[str, Any]:
        """Get a performance summary with health status"""
        current_metrics = self.get_current_metrics()

        # Determine health status
        health_status = "healthy"
        issues = []

        if current_metrics.cpu_percent > 80:
            health_status = "warning"
            issues.append("High CPU usage")

        if current_metrics.memory_percent > 85:
            health_status = "warning"
            issues.append("High memory usage")

        if current_metrics.disk_percent > 90:
            health_status = "critical"
            issues.append("High disk usage")

        if current_metrics.cpu_percent > 95:
            health_status = "critical"
            issues.append("Critical CPU usage")

        # Get recent trends
        recent_metrics = self.get_metrics_history(limit=10)
        trends = {}

        if len(recent_metrics) > 1:
            cpu_trend = recent_metrics[-1]["cpu_percent"] - recent_metrics[0]["cpu_percent"]
            memory_trend = recent_metrics[-1]["memory_percent"] - recent_metrics[0]["memory_percent"]

            trends = {
                "cpu_trend_percent": cpu_trend,
                "memory_trend_percent": memory_trend
            }

        return {
            "status": health_status,
            "timestamp": current_metrics.timestamp.isoformat(),
            "current_metrics": {
                "cpu_percent": current_metrics.cpu_percent,
                "memory_percent": current_metrics.memory_percent,
                "disk_percent": current_metrics.disk_percent
            },
            "issues": issues,
            "trends": trends,
            "uptime_hours": (current_metrics.timestamp - current_metrics.boot_time).total_seconds() / 3600
        }

    def cleanup(self):
        """Clean up resources"""
        self.stop_monitoring()
        self.metrics_history.clear()
        logger.info("PerformanceMonitor cleanup completed")

# Global performance monitor instance
performance_monitor = PerformanceMonitor()
