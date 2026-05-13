export async function fetchGithubProfile(username: string, token?: string) {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com/users/${username}`, { headers });
  if (!res.ok) throw new Error("Failed to fetch GitHub profile");
  return res.json();
}

export async function fetchGithubRepos(username: string, token?: string) {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Fetching up to 100 repos
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
    { headers }
  );
  if (!res.ok) throw new Error("Failed to fetch GitHub repos");
  return res.json();
}

export async function fetchGithubLanguages(username: string, repos: any[], token?: string) {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const languageMap: Record<string, number> = {};

  // We take the top 10 most recently updated repos to avoid rate limits
  const topRepos = repos.filter(r => !r.fork).slice(0, 10);

  for (const repo of topRepos) {
    try {
      const res = await fetch(repo.languages_url, { headers });
      if (res.ok) {
        const langs = await res.json();
        for (const [lang, bytes] of Object.entries(langs)) {
          if (!languageMap[lang]) languageMap[lang] = 0;
          languageMap[lang] += bytes as number;
        }
      }
    } catch (e) {
      console.error(`Failed to fetch languages for ${repo.name}`);
    }
  }

  return languageMap;
}

export async function aggregateGithubData(username: string, token?: string) {
  const profile = await fetchGithubProfile(username, token);
  const repos = await fetchGithubRepos(username, token);
  const languages = await fetchGithubLanguages(username, repos, token);

  const totalStars = repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);
  const totalForks = repos.reduce((acc: number, repo: any) => acc + repo.forks_count, 0);

  // Extract deeper repo intelligence
  const repoIntelligence = repos.slice(0, 15).map((r: any) => ({
    name: r.name,
    description: r.description,
    topics: r.topics || [],
    language: r.language,
    size: r.size,
    created_at: r.created_at,
    updated_at: r.updated_at
  }));

  return {
    profile,
    reposCount: repos.length,
    repoIntelligence,
    totalStars,
    totalForks,
    languages,
  };
}
