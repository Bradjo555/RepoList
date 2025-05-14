use axum::serve;
use dotenv::dotenv;
use routes::create_routes;
use tokio::net::TcpListener;

mod routes;
pub mod models;

#[tokio::main]
async fn main() {
    dotenv().ok();
    
    let app = create_routes().await;
    let listener = TcpListener::bind("127.0.0.1:8000").await.unwrap();
    let _ = serve(listener, app.into_make_service()).await.unwrap();
}
