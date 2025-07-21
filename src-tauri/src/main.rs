// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{dialog::FileDialogBuilder, Manager, Runtime};
use std::fs;

#[tauri::command]
async fn save_file<R: Runtime>(app: tauri::AppHandle<R>, content: String) -> Result<(), String> {
    let window = app.get_webview_window("main").unwrap();
    let mut builder = FileDialogBuilder::new(&app);
    builder = builder.add_filter("SignalPath Project", &["icd"]);
    builder = builder.set_file_name("untitled.icd");

    // Use a closure to handle the file path asynchronously
    builder.save_file(move |file_path| {
        if let Some(path) = file_path {
            if let Err(e) = fs::write(path, content) {
                // Handle potential write error, though we can't return a Result directly here
                eprintln!("Failed to write file: {}", e);
            }
        }
    });
    Ok(())
}

#[tauri::command]
async fn open_file<R: Runtime>(app: tauri::AppHandle<R>) -> Result<String, String> {
    let window = app.get_webview_window("main").unwrap();
    let (sender, receiver) = std::sync::mpsc::channel();
    let mut builder = FileDialogBuilder::new(&app);
    builder = builder.add_filter("SignalPath Project", &["icd"]);

    // Use a closure to send the result back to our async context
    builder.pick_file(move |file_path| {
        sender.send(file_path).unwrap();
    });

    // Block and wait for the dialog to close
    match receiver.recv().unwrap() {
        Some(path) => fs::read_to_string(path).map_err(|e| e.to_string()),
        None => Err("No file selected".to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .invoke_handler(tauri::generate_handler![save_file, open_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}