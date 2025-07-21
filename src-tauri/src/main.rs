// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{api::dialog, Manager};
use std::fs;

// --- NEW COMMAND: SAVE FILE ---
// This function will be callable from the frontend
#[tauri::command]
async fn save_file(app: tauri::AppHandle, content: String) -> Result<(), String> {
    let file_path = dialog::blocking::save_file(Some(&app.get_window("main").unwrap()),)
        .filter(|p| p.to_str().unwrap_or("").ends_with(".icd"))
        .or_else(|| {
            // If the user didn't add the extension, add it for them
            dialog::blocking::save_file(Some(&app.get_window("main").unwrap()),)
                .map(|p| p.with_extension("icd"))
        });

    if let Some(path) = file_path {
        fs::write(path, content).map_err(|e| e.to_string())
    } else {
        Ok(()) // User cancelled the dialog
    }
}


// --- NEW COMMAND: OPEN FILE ---
#[tauri::command]
async fn open_file(app: tauri::AppHandle) -> Result<String, String> {
    let file_path = dialog::blocking::open_file(Some(&app.get_window("main").unwrap()),)
        .filter(|p| p.to_str().unwrap_or("").ends_with(".icd"));

    if let Some(path) = file_path {
        fs::read_to_string(path).map_err(|e| e.to_string())
    } else {
        Err("No file selected".to_string())
    }
}


fn main() {
    tauri::Builder::default()
        // --- REGISTER THE COMMANDS ---
        // This makes the Rust functions available to the frontend
        .invoke_handler(tauri::generate_handler![save_file, open_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}