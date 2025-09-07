import { HashRouter, Route, Routes } from 'react-router-dom'; // Note: corrected import
import HomePage from './pages/Home';
import CodeAnalysis from './components/CodeAnalysis';
import SystemManagement from './components/SystemManagement';
import CodeGeneration from './components/CodeGeneration';
import EnhancedCodeGeneration from './components/EnhancedCodeGeneration';
import ModelManagement from './components/ModelManagement';
import ModelTraining from './components/ModelTraining';
import PluginManagement from './components/PluginManagement';
import Documentation from './components/Documentation';
import Settings from './components/Settings';
import PerformanceMonitor from './components/PerformanceMonitor';
import RealTimeMonitor from './components/RealTimeMonitor';
import AdvancedConfig from './components/AdvancedConfig';
import HelpPanel from './components/HelpPanel';

export default function App() {
  return (
    <HashRouter>
    <div>
    <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/code-analysis" element={<CodeAnalysis />} />
    <Route path="/system" element={<SystemManagement />} />
    <Route path="/generate" element={<CodeGeneration />} />
    <Route path="/enhanced-generate" element={<EnhancedCodeGeneration />} />
    <Route path="/models" element={<ModelManagement />} />
    <Route path="/training" element={<ModelTraining />} />
    <Route path="/plugins" element={<PluginManagement />} />
    <Route path="/docs" element={<Documentation />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/performance" element={<PerformanceMonitor />} />
    <Route path="/realtime" element={<RealTimeMonitor />} />
    <Route path="/config" element={<AdvancedConfig />} />
    </Routes>
    <HelpPanel /> {/* Add HelpPanel here */}
    </div>
    </HashRouter>
  );
}
