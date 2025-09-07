"""
Health Checker Service
Handles comprehensive health checks for the AI service and system
"""

import asyncio
import time
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
import psutil

from services.performance_monitor import performance_monitor

logger = logging.getLogger(__name__)

class HealthChecker:
    """Handles health checks for the AI service and system"""

    def __init__(self, model_manager=None, performance_monitor=None):
        self.model_manager = model_manager
        self.performance_monitor = performance_monitor or performance_monitor
        self.health_check_history = []
        self.max_history_size = 100

        logger.info("HealthChecker initialized")

    async def check_health(self) -> Dict[str, Any]:
        """Perform comprehensive health check"""
        try:
            logger.info("Performing comprehensive health check")

            # System health checks
            system_health = await self._check_system_health()

            # Model health checks
            model_health = await self._check_model_health()

            # Performance health checks
            performance_health = await self._check_performance_health()

            # Service health checks
            service_health = await self._check_service_health()

            # Calculate overall health status
            overall_status = self._calculate_overall_status(
                system_health, model_health, performance_health, service_health
            )

            # Create health report
            health_report = {
                "status": overall_status,
                "timestamp": datetime.now().isoformat(),
                "uptime_seconds": self._get_uptime(),
                "system_health": system_health,
                "model_health": model_health,
                "performance_health": performance_health,
                "service_health": service_health,
                "recommendations": self._generate_recommendations(
                    system_health, model_health, performance_health, service_health
                )
            }

            # Store in history
            self.health_check_history.append(health_report)
            if len(self.health_check_history) > self.max_history_size:
                self.health_check_history = self.health_check_history[-self.max_history_size:]

            logger.info(f"Health check completed. Status: {overall_status}")
            return health_report

        except Exception as e:
            logger.error(f"Error during health check: {e}")
            return {
                "status": "error",
                "timestamp": datetime.now().isoformat(),
                "error": str(e),
                "uptime_seconds": self._get_uptime()
            }

    async def _check_system_health(self) -> Dict[str, Any]:
        """Check system health metrics"""
        try:
            # Get current system metrics
            metrics = self.performance_monitor.get_current_metrics()

            # Determine system health status
            system_status = "healthy"
            issues = []

            # CPU health
            if metrics.cpu_percent > 90:
                system_status = "critical"
                issues.append("Critical CPU usage")
            elif metrics.cpu_percent > 75:
                system_status = "warning"
                issues.append("High CPU usage")

            # Memory health
            if metrics.memory_percent > 90:
                system_status = "critical"
                issues.append("Critical memory usage")
            elif metrics.memory_percent > 80:
                system_status = "warning"
                issues.append("High memory usage")

            # Disk health
            if metrics.disk_percent > 95:
                system_status = "critical"
                issues.append("Critical disk usage")
            elif metrics.disk_percent > 85:
                system_status = "warning"
                issues.append("High disk usage")

            # Process health
            if metrics.process_count > 1000:
                system_status = "warning"
                issues.append("High process count")

            return {
                "status": system_status,
                "issues": issues,
                "metrics": {
                    "cpu_percent": metrics.cpu_percent,
                    "memory_percent": metrics.memory_percent,
                    "disk_percent": metrics.disk_percent,
                    "process_count": metrics.process_count,
                    "uptime_hours": (metrics.timestamp - metrics.boot_time).total_seconds() / 3600
                }
            }

        except Exception as e:
            logger.error(f"Error checking system health: {e}")
            return {
                "status": "error",
                "issues": [f"System health check failed: {str(e)}"],
                "metrics": {}
            }

    async def _check_model_health(self) -> Dict[str, Any]:
        """Check AI model health"""
        try:
            if not self.model_manager:
                return {
                    "status": "not_available",
                    "issues": ["Model manager not available"],
                    "models": {}
                }

            # Get model information
            models = await self.model_manager.list_models()

            model_status = "healthy"
            issues = []
            model_details = {}

            total_models = len(models)
            healthy_models = 0

            for model in models:
                model_id = model["id"]
                model_status_detail = model["status"]

                model_details[model_id] = {
                    "status": model_status_detail,
                    "name": model["name"],
                    "size": model["size"],
                    "capabilities": model["capabilities"]
                }

                if model_status_detail == "loaded":
                    healthy_models += 1
                elif model_status_detail == "error":
                    model_status = "warning"
                    issues.append(f"Model {model_id} in error state")
                elif model_status_detail == "not_downloaded":
                    issues.append(f"Model {model_id} not downloaded")

            # Determine overall model health
            if total_models == 0:
                model_status = "not_available"
                issues.append("No models available")
            elif healthy_models == 0:
                model_status = "critical"
                issues.append("No healthy models available")
            elif healthy_models < total_models * 0.5:
                model_status = "warning"
                issues.append("Less than 50% of models are healthy")

            return {
                "status": model_status,
                "issues": issues,
                "models": model_details,
                "summary": {
                    "total_models": total_models,
                    "healthy_models": healthy_models,
                    "health_percentage": (healthy_models / total_models * 100) if total_models > 0 else 0
                }
            }

        except Exception as e:
            logger.error(f"Error checking model health: {e}")
            return {
                "status": "error",
                "issues": [f"Model health check failed: {str(e)}"],
                "models": {},
                "summary": {"total_models": 0, "healthy_models": 0, "health_percentage": 0}
            }

    async def _check_performance_health(self) -> Dict[str, Any]:
        """Check performance metrics health"""
        try:
            # Get performance metrics
            resources = self.performance_monitor.get_system_resources()
            metrics = self.performance_monitor.get_current_metrics()

            performance_status = "healthy"
            issues = []

            # Check CPU temperature
            if "cpu" in resources and "temperature" in resources["cpu"]:
                cpu_temp = resources["cpu"]["temperature"]
                if cpu_temp and cpu_temp > 80:
                    performance_status = "warning"
                    issues.append(f"High CPU temperature: {cpu_temp}°C")

            # Check memory pressure
            if "memory" in resources:
                memory_pressure = resources["memory"]["memory_percent"]
                if memory_pressure > 85:
                    performance_status = "warning"
                    issues.append("High memory pressure")

            # Check disk I/O (simplified check)
            if "disk" in resources:
                disk_usage = resources["disk"]["disk_percent"]
                if disk_usage > 90:
                    performance_status = "warning"
                    issues.append("High disk usage affecting performance")

            # Check network latency (simplified)
            if "network" in resources:
                # This would require actual network latency monitoring
                # For now, we'll skip this check
                pass

            return {
                "status": performance_status,
                "issues": issues,
                "resources": resources,
                "current_metrics": {
                    "cpu_percent": metrics.cpu_percent,
                    "memory_percent": metrics.memory_percent,
                    "disk_percent": metrics.disk_percent
                }
            }

        except Exception as e:
            logger.error(f"Error checking performance health: {e}")
            return {
                "status": "error",
                "issues": [f"Performance health check failed: {str(e)}"],
                "resources": {},
                "current_metrics": {}
            }

    async def _check_service_health(self) -> Dict[str, Any]:
        """Check AI service health"""
        try:
            service_status = "healthy"
            issues = []

            # Check if we can access model manager
            if not self.model_manager:
                service_status = "warning"
                issues.append("Model manager not available")

            # Check if performance monitor is accessible
            if not self.performance_monitor:
                service_status = "warning"
                issues.append("Performance monitor not available")

            # Check response time (simulated)
            start_time = time.time()
            # Simulate a quick operation
            await asyncio.sleep(0.1)
            response_time = (time.time() - start_time) * 1000

            if response_time > 1000:  # 1 second
                service_status = "warning"
                issues.append(f"Slow response time: {response_time:.2f}ms")

            # Check available memory for the service
            process = psutil.Process()
            memory_info = process.memory_info()
            memory_usage_mb = memory_info.rss / 1024 / 1024

            if memory_usage_mb > 500:  # 500MB
                service_status = "warning"
                issues.append(f"High memory usage: {memory_usage_mb:.2f}MB")

            return {
                "status": service_status,
                "issues": issues,
                "metrics": {
                    "response_time_ms": response_time,
                    "memory_usage_mb": memory_usage_mb,
                    "thread_count": process.num_threads(),
                    "cpu_percent": process.cpu_percent()
                }
            }

        except Exception as e:
            logger.error(f"Error checking service health: {e}")
            return {
                "status": "error",
                "issues": [f"Service health check failed: {str(e)}"],
                "metrics": {}
            }

    def _calculate_overall_status(self, system_health, model_health, performance_health, service_health) -> str:
        """Calculate overall health status"""
        status_priority = {
            "critical": 4,
            "error": 3,
            "warning": 2,
            "not_available": 1,
            "healthy": 0
        }

        # Get the highest priority status
        statuses = [
            system_health["status"],
            model_health["status"],
            performance_health["status"],
            service_health["status"]
        ]

        highest_priority = 0
        for status in statuses:
            priority = status_priority.get(status, 0)
            if priority > highest_priority:
                highest_priority = priority

        # Map back to status string
        for status_str, priority_val in status_priority.items():
            if priority_val == highest_priority:
                return status_str

        return "unknown"

    def _generate_recommendations(self, system_health, model_health, performance_health, service_health) -> List[str]:
        """Generate health improvement recommendations"""
        recommendations = []

        # System recommendations
        if system_health["status"] in ["warning", "critical"]:
            if any("CPU" in issue for issue in system_health["issues"]):
                recommendations.append("Consider closing unnecessary applications or processes to reduce CPU usage")
            if any("memory" in issue for issue in system_health["issues"]):
                recommendations.append("Free up memory by closing unused applications or increasing system RAM")
            if any("disk" in issue for issue in system_health["issues"]):
                recommendations.append("Clean up disk space or consider expanding storage capacity")

        # Model recommendations
        if model_health["status"] in ["warning", "critical"]:
            if model_health["summary"]["health_percentage"] < 50:
                recommendations.append("Download and load more AI models to improve service capabilities")
            recommendations.append("Check model logs for errors and consider reloading problematic models")

        # Performance recommendations
        if performance_health["status"] == "warning":
            recommendations.append("Optimize system performance by addressing resource bottlenecks")
            if any("temperature" in issue for issue in performance_health["issues"]):
                recommendations.append("Improve system cooling to reduce CPU temperature")

        # Service recommendations
        if service_health["status"] == "warning":
            if any("memory" in issue for issue in service_health["issues"]):
                recommendations.append("Restart the AI service to free up memory")
            if any("response" in issue for issue in service_health["issues"]):
                recommendations.append("Check system resources and network connectivity")

        # General recommendations if everything is healthy
        if all(health["status"] == "healthy" for health in [system_health, model_health, performance_health, service_health]):
            recommendations.append("System is running optimally. Continue regular monitoring.")
            recommendations.append("Consider setting up automated health checks for early issue detection.")

        return recommendations

    def _get_uptime(self) -> float:
        """Get system uptime in seconds"""
        try:
            boot_time = psutil.boot_time()
            return (datetime.now().timestamp() - boot_time)
        except Exception:
            return 0

    def get_health_history(self, limit: Optional[int] = None) -> List[Dict[str, Any]]:
        """Get health check history"""
        history = self.health_check_history
        if limit:
            history = history[-limit:]
        return history

    async def run_specific_check(self, check_type: str) -> Dict[str, Any]:
        """Run a specific type of health check"""
        if check_type == "system":
            return await self._check_system_health()
        elif check_type == "models":
            return await self._check_model_health()
        elif check_type == "performance":
            return await self._check_performance_health()
        elif check_type == "service":
            return await self._check_service_health()
        else:
            return {"status": "error", "issues": [f"Unknown check type: {check_type}"]}

    def cleanup(self):
        """Clean up resources"""
        self.health_check_history.clear()
        logger.info("HealthChecker cleanup completed")

# Global health checker instance
health_checker = HealthChecker()
