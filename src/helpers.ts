import { RepoProps } from "./types";

export function extractRepoInfo(repos: any[]): RepoProps[] {
  return repos.map(repo => ({
    name: repo.name,
    language: repo.language,
    created_at: repo.created_at,
    updated_at: repo.updated_at,
    html_url: repo.html_url,
  }));
}

export function formatTime(input: string): string {
    const date = new Date(input);
    const output = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
    
    return output;
}
