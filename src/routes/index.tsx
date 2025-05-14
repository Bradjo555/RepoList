import { IoInformationCircle } from "solid-icons/io";
import { For, createSignal } from "solid-js";
import { ProjectCard } from "~/components/ProjectCard";
import { formatTime } from "~/helpers";
import { RepoProps } from "~/types";

export default function Home() {
    const [repos, setRepos] = createSignal<RepoProps[]>([]);


    const getRepo = async () => {
        try {
            const res = await fetch("http://localhost:8000/")
            const data = await res.json()

            try {
                data.map((repo: RepoProps) => {
                    if (repo.language != null) {
                        setRepos(prev => [...prev, repo])
                    }
                    
                })
            } catch(e) {
                console.log(e)
            }

        } catch(e) {
            console.log(e)
        }
    };

    getRepo();

  return (
      <main>
        <div class="w-6/12 mx-auto">
            <h1 class="font-bold text-3xl text-[#101010]"> Projects </h1>
            
            <div class="w-full h-0.5 bg-neutral-100 mb-6 mt-3"></div>
            
            <div class="bg-indigo-50 border  border-indigo-500 p-4 rounded-md mb-6">
                <p class="text-indigo-800 flex items-center gap-2"> <IoInformationCircle class="w-[24px] h-[24px]" /> Want to see more? More projects are also listed on my<a target="_blank" class="underline font-bold" href="https://github.com/Bradjo555">Github</a> </p>
            </div>
           
            {/* Load projects using github api */}
            <div class="grid grid-cols-2 grid-rows-3 gap-3 place-items-center">
                <For each={repos()} fallback={ <p class="opacity-50 text-center">Loading projects...</p> }>
                    {(repo) => (
                            <ProjectCard 
                            name={repo.name} 
                            language={repo.language} 
                            created_at={formatTime(repo.created_at)} 
                            html_url={repo.html_url} />
                    )}
                </For>
            </div>
        </div>
      </main>
  );
}
