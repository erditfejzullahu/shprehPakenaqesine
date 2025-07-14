"use client";

import { CompanyInterface } from "@/types/types";
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
import { useState } from "react";

const CompaniesPage = ({ companies }: { companies: CompanyInterface[] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filter and sort companies
  const filteredCompanies = companies
    .filter((company) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        company.name.toLowerCase().includes(searchLower) ||
        company.industry?.toLowerCase().includes(searchLower) ||
        company.description?.toLowerCase().includes(searchLower) ||
        company.address?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "complaints-asc":
          return (a.complaintsCount || 0) - (b.complaintsCount || 0);
        case "complaints-desc":
          return (b.complaintsCount || 0) - (a.complaintsCount || 0);
        case "industry-asc":
          return (a.industry || "").localeCompare(b.industry || "");
        case "industry-desc":
          return (b.industry || "").localeCompare(a.industry || "");
        case "founded-asc":
          return (a.foundedYear || "").localeCompare(b.foundedYear || "");
        case "founded-desc":
          return (b.foundedYear || "").localeCompare(a.foundedYear || "");
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kompanitë</h1>
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
          {filteredCompanies.length} kompani{filteredCompanies.length !== 1 ? " të" : ""} gjetura
        </div>

        {/* Companies List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} {...company} />
            ))}
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
                {filteredCompanies.map((company) => (
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
        {filteredCompanies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="text-muted-foreground text-center">
              <p className="text-lg">Nuk u gjet asnjë kompani</p>
              <p className="text-sm">Provoni të modifikoni kërkimin tuaj</p>
            </div>
            <Button
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
    </div>
  );
};

export default CompaniesPage;