import { useEffect, useState } from "react"
import { Data } from "../types"
import { useDebounce } from "@uidotdev/usehooks"
import { searchData } from "../services/Search"
import { toast } from "sonner"

const DEBOUNCE_TIME=250
export const Search=({initialData}:{initialData: Data})=>{
    const [data, setData]=useState<Data>(initialData)
    const [search, setSearch]=useState<string>(()=>{
        const searchParams= new URLSearchParams(window.location.search)
        return searchParams.get('q')?? ''
    })
    const debounceSearch = useDebounce(search,DEBOUNCE_TIME)
    
    const handleSearch=(event: React.ChangeEvent<HTMLInputElement>)=>{
        setSearch(event.target.value)
    }
    useEffect(()=>{
        const newPathname = debounceSearch===''?window.location.pathname:`?q=${debounceSearch}`
        window.history.pushState({},'',newPathname)
    },[debounceSearch])

    useEffect(()=>{
        if(!debounceSearch){
            setData(initialData)
            return
        }
        searchData(debounceSearch)
        .then(response=>{   
            const [err, newData]=response
            if(err){
                toast.error(err.message)
                return
            }
            if (newData) setData(newData)
        })
    }, [debounceSearch, initialData])

    return (
        <div>
            <h1>Search</h1>
            <form>
                <input onChange={handleSearch} type="search" placeholder="Buscar informacion" />
            </form>
            <ul>
                {
                    data.map((row)=>(
                        <li key={row.id}>
                            <article>
                                {Object.entries(row).map(([key,value])=><p key={key}><strong>{key}:</strong>{value}</p>)}
                            </article>
                        </li>
                    )) 
                }
            </ul>
        </div>

    )
}