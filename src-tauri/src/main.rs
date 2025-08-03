// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, Runtime};
use tauri::TauriPlugin::Dialog;
use std::fs;
use std::path::PathBuf;

#[tauri::command]
async fn save_file<R: Runtime>(app: tauri::AppHandle<R>, content: String) -> Result<(), String> {
    let mut builder = dialog::FileDialogBuilder::new(&app);
    builder.add_filter("SignalPath Project", &["icd"]);
    builder.set_file_name("untitled.icd");

    let file_path: Option<PathBuf> = builder.save_file().await.map_err(|e| e.to_string())?;

    if let Some(path) = file_path {
        fs::write(path, content).map_err(|e| e.to_string())?;
    }
    
    Ok(())
}

#[tauri::command]
async fn open_file<R: Runtime>(app: tauri::AppHandle<R>) -> Result<String, String> {
    let mut builder = dialog::FileDialogBuilder::new(&app);
    builder.add_filter("SignalPath Project", &["icd"]);

    let file_path: Option<PathBuf> = builder.pick_file().await.map_err(|e| e.to_string())?;

    match file_path {
        Some(path) => fs::read_to_string(path).map_err(|e| e.to_string()),
        None => Err("No file selected".to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .plugin(tauri_plugin_dialog::init()) // Add this line to register the plugin
        .invoke_handler(tauri::generate_handler![save_file, open_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}