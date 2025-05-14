use std::result::Result::{Ok, Err};
use anyhow::Ok as AnyhowOk;
use axum::{response::IntoResponse, Json};
use futures::future::join_all;
use octocrate::MinimalRepository;
use tower_http::cors::CorsLayer;

use crate::models::ApiRepo;

pub async fn create_routes() -> axum::Router {
    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<axum::http::HeaderValue>().unwrap())
        .allow_methods([axum::http::Method::GET])
        .allow_headers([axum::http::header::CONTENT_TYPE, axum::http::header::AUTHORIZATION]);

    axum::Router::new().route("/", axum::routing::get(repos_handler)).layer(cors)
}

pub async fn repos_handler() -> impl IntoResponse {
    match fetch_all_repos().await {
        Ok(repos) => Json(repos).into_response(),
        Err(err) => {
            eprintln!("Error fetching repos: {:?}", err);
            (axum::http::StatusCode::INTERNAL_SERVER_ERROR, "Failed to fetch repos").into_response()
        }
    }
}

pub async fn fetch_all_repos() -> Result<Vec<ApiRepo>, anyhow::Error> {
    let raw_repos = get_all_public_repos().await.unwrap();
    let converted = convert_repo_struct(raw_repos).await.unwrap();
    Ok(converted)
}

pub async fn get_all_public_repos() -> Result<Vec<MinimalRepository>, ()> {
    dotenv::dotenv().ok();
    
    let config = octocrate::APIConfig::default().shared();
    let api = octocrate::GitHubAPI::new(&config);

    let repositories = api.repos.list_for_user("Bradjo555").send().await.unwrap();
    Ok(repositories)
}

pub async fn convert_repo_struct(repos: Vec<MinimalRepository>) -> Result<Vec<ApiRepo>, anyhow::Error> {
    let tasks = repos.into_iter().map(|repo| {
        tokio::spawn(async move {
            AnyhowOk(ApiRepo {
                name: repo.name.clone(),
                html_url: repo.html_url.clone(),
                created_at: repo.created_at.clone(),
                language: repo.language.clone(),
            })
        })
    });

    let results = join_all(tasks).await;

    let mut converted = Vec::new();
    for result in results {
        match result {
            Ok(Ok(repo)) => converted.push(repo),
            Ok(Err(err)) => return Err(err),
            Err(join_err) => return Err(anyhow::anyhow!("Join error: {}", join_err)),
        }
    }

    Ok(converted)
}
