import { RepoProps } from "~/types"
import { BiRegularRightArrowAlt } from "solid-icons/bi"

export const ProjectCard = (props: RepoProps) => {
    return (
        <a href={props.html_url} target="_blank" class="w-full transition-all group hover:shadow-md hover:border-indigo-500 shadow-sm h-36 border flex flex-col justify-between p-6 rounded-md border-neutral-200 ">
            <div class="flex justify-between">
                <p class="text-xl"> {props.name} </p>
                {props.language ? (
                    <img class="w-[32px] h-[32px]" src={"icons/" + props.language + ".png"} />
                ) : (
                    <p>  </p>
                )}
            </div>
            <div class="flex justify-between">
                <p class="opacity-50 text-sm">{props.created_at}</p>
                <span> <BiRegularRightArrowAlt class="w-5 h-5 opacity-50 group-hover:text-indigo-500 group-hover:opacity-100"/> </span>
            </div>
        </a>
    )
}
