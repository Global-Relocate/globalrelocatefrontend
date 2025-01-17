import CountriesCard from "@/components/cards/CountriesCard";
import SearchInput from "@/components/inputs/SearchInput";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import FilterButton from "@/components/utils/FilterButton";
import React from "react";
// countries imports
import nigeria from "../../assets/images/nigeria.png";
import swizerland from "../../assets/images/swizerland.png";
import london from "../../assets/images/london.png";
import italy from "../../assets/images/italy.png";
import china from "../../assets/images/china.png";
import uae from "../../assets/images/uae.png";

function Countries() {
  return (
    <DashboardLayout>
      <div className="w-full flex-wrap gap-y-5 items-center justify-between flex">
        <h2 className="text-3xl font-medium">Countries</h2>

        <div className="flex w-full sm:w-auto  items-center space-x-2">
          <SearchInput />
          <FilterButton />
        </div>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-y-10  py-10">
        <CountriesCard
          sm={true}
          image={swizerland}
          location="Zürich, Switzerland"
          countryImage="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Flag_of_Switzerland_%28Pantone%29.svg/1200px-Flag_of_Switzerland_%28Pantone%29.svg.png"
        />
        <CountriesCard
          sm={true}
          image={london}
          location="London, UK"
          countryImage="https://t4.ftcdn.net/jpg/08/32/02/87/360_F_832028757_4YU1BrvVBRUNJX7WvLf5g4Qm5xrjOBo6.jpg"
        />
        <CountriesCard
          sm={true}
          image={china}
          location="Beijing, China"
          countryImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx-FLVbYtX7A6P_Zjkt5pp0DafB3gXraLsNQ&s"
        />
        <CountriesCard
          sm={true}
          image={italy}
          location="Milan, Italy"
          countryImage="https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Flag_of_Italy.svg/220px-Flag_of_Italy.svg.png"
        />
        <CountriesCard
          sm={true}
          image={uae}
          location="UAE"
          countryImage="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_United_Arab_Emirates.svg/1200px-Flag_of_the_United_Arab_Emirates.svg.png"
        />
        <CountriesCard
          sm={true}
          image={nigeria}
          location="Lagos, Nigeria"
          countryImage="https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg"
        />
        <CountriesCard
          sm={true}
          image={nigeria}
          location="Lagos, Nigeria"
          countryImage="https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg"
        />
        <CountriesCard
          sm={true}
          image={nigeria}
          location="Lagos, Nigeria"
          countryImage="https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg"
        />
      </div>
    </DashboardLayout>
  );
}

export default Countries;
