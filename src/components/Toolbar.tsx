import React from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { useSchematicStore } from '../store/schematicStore';

const Toolbar: React.FC = () => {
  const { components, nets, loadProject } = useSchematicStore();

  const handleSave = async () => {
    try {
      // Prepare the state for serialization
      const projectState = {
        components,
        nets,
        // Add any other state you want to save
      };
      const jsonContent = JSON.stringify(projectState, null, 2);

      // Invoke the Rust 'save_file' command
      await invoke('save_file', { content: jsonContent });
      console.log('Project saved successfully!');
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleOpen = async () => {
    try {
      // Invoke the Rust 'open_file' command
      const jsonContent = await invoke<string>('open_file');
      if (jsonContent) {
        loadProject(jsonContent); // You will create this function next
        console.log('Project opened successfully!');
      }
    } catch (error) {
      console.error('Failed to open project:', error);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '10px',
      padding: '8px 12px',
      backgroundColor: 'rgba(240, 248, 255, 0.95)',
      borderRadius: '8px',
      border: '1px solid #ccc',
      zIndex: 20,
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    }}>
      <button onClick={handleSave}>Save Project</button>
      <button onClick={handleOpen}>Open Project</button>
    </div>
  );
};

export default Toolbar;