use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct ApiRepo {
    pub name: String,
    pub html_url: String,
    pub created_at: Option<String>,
    pub language: Option<String>,
}
