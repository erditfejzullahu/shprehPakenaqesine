"use client";

import { CompaniesWithHasMore, CompanyInterface } from "@/types/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CompanyCard from "@/components/CompanyCard";
import { Grid3x3, List } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { LoadingSpinner } from "./LoadingComponents";
import { FaArrowRight, FaChevronDown } from "react-icons/fa";
import CTAButton from "./CTAButton";
import debounce from "lodash/debounce"
import Link from "next/link";


const AllCompaniesCard = () => {
    useEffect(() => {
      console.log("redeed");
      
    },)
    
    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch, isRefetching} = useInfiniteQuery({
        queryKey: ['companies'],
        queryFn: async ({pageParam}) => {
            const res = await api.get<CompaniesWithHasMore>(`/api/companies?page=${pageParam}&limit=9&search=${encodeURIComponent(searchTerm)}&sortBy=${sortBy}`)
            return res.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.hasMore ? allPages.length + 1 : undefined,
        retry: false,
        refetchOnWindowFocus: false 
    })    

    const debouncedSearch = useMemo(() => (
        debounce(() => {
            refetch()
        }, 500)
    ), [])

    
    
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    
    useEffect(() => {
        if(sortBy){
            refetch()
        }
    }, [sortBy])
    
    useEffect(() => {
        if(searchTerm){            
            debouncedSearch()
        }
    }, [searchTerm])
  

    if(isLoading || isRefetching) return <div className="py-8"><LoadingSpinner /></div>
    if(!data) return <div className="mx-auto flex flex-col items-center right-0 left-0 -top-6 my-8">
        <div className="flex flex-row gap-1">
          <div>
            <h3 className="text-gray-600 font-normal mb-3">Nuk ka te dhena. Nese mendoni qe eshte gabim</h3>
          </div>
          <div className="pt-2 rotate-[50deg]">
          <FaChevronDown size={22} color='#4f46e5'/>
          </div>
        </div>
        <CTAButton onClick={() => refetch()} text='Provo perseri'/>
      </div> 
      if(isError) return <div className="mx-auto flex flex-col items-center right-0 left-0 -top-6">
        <div className="flex flex-row gap-1">
          <div>
            <h3 className="text-gray-600 font-normal mb-3">Dicka shkoi gabim. Provoni perseri!</h3>
          </div>
          <div className="pt-2 rotate-[50deg]">
          <FaChevronDown size={22} color='#4f46e5'/>
          </div>
        </div>
        <CTAButton onClick={() => refetch()} text='Provo perseri'/>
      </div> 

    const companies = data?.pages.flatMap((page) => page.companies) || []
    const totalCount = data?.pages[0]?.filteredOrNotFilteredCount || 0;
    
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Link className="text-indigo-600 font-semibold hover:text-xl transition-all ease-in-out flex flex-row gap-1 text-lg w-fit" href={'/shto-kompani'}>Shtoni Kompani <FaArrowRight className="rotate-[-35deg]"/></Link>
            <p className="text-muted-foreground">
              Lista e të gjitha kompanive në platformën tonë
            </p>
          </div>
          
          {/* View Toggle */}
          <Tabs
            value={viewMode}
            onValueChange={(value) => setViewMode(value as "grid" | "table")}
            className="hidden md:block"
          >
            <TabsList>
              <TabsTrigger value="grid">
                <Grid3x3 className="h-4 w-4 mr-2" />
                Grid
              </TabsTrigger>
              <TabsTrigger value="table">
                <List className="h-4 w-4 mr-2" />
                Tabelë
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Kërko kompani..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Rendit sipas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Emri (A-Z)</SelectItem>
                <SelectItem value="name-desc">Emri (Z-A)</SelectItem>
                <SelectItem value="complaints-asc">Ankesat (Pak)</SelectItem>
                <SelectItem value="complaints-desc">Ankesat (Shumë)</SelectItem>
                <SelectItem value="industry-asc">Industria (A-Z)</SelectItem>
                <SelectItem value="industry-desc">Industria (Z-A)</SelectItem>
                <SelectItem value="founded-asc">Viti i Them. (Vjetër)</SelectItem>
                <SelectItem value="founded-desc">Viti i Them. (I Ri)</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile view toggle */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
            >
              {viewMode === "grid" ? (
                <List className="h-4 w-4" />
              ) : (
                <Grid3x3 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-muted-foreground">
        {totalCount} kompani{totalCount !== 1 ? " të gjetura" : " e gjetur"}
        </div>

        {/* Companies List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => 
              <CompanyCard key={company.id} {...company} />
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kompania</TableHead>
                  <TableHead>Industria</TableHead>
                  <TableHead>Adresa</TableHead>
                  <TableHead>Viti i Them.</TableHead>
                  <TableHead className="text-right">Ankesa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id} className="hover:bg-gray-50 cursor-pointer">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <img
                          src={company.logoUrl}
                          alt={company.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <div>
                          <div>{company.name}</div>
                          {company.website && (
                            <div className="text-xs text-muted-foreground">
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {company.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{company.industry || "-"}</TableCell>
                    <TableCell>{company.address || "-"}</TableCell>
                    <TableCell>{company.foundedYear || "-"}</TableCell>
                    <TableCell className="text-right">
                      {company.complaintsCount || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Empty State */}
        {companies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="text-muted-foreground text-center">
              <p className="text-lg">Nuk u gjet asnjë kompani</p>
              <p className="text-sm">Provoni të modifikoni kërkimin tuaj</p>
            </div>
            <Button
            className="cursor-pointer"
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSortBy("name-asc");
              }}
            >
              Filtro të gjitha kompanitë
            </Button>
          </div>
        )}
      </div>
        {hasNextPage && (
            <div className="mt-8 mx-auto flex items-center justify-between ">
            <CTAButton onClick={() => fetchNextPage()} classNames="mx-auto" isLoading={isFetchingNextPage} text='Me shume' primary/>
            </div>
        )}
    </div>
  );
};

export default memo(AllCompaniesCard);