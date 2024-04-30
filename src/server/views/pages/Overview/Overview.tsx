import { Nav } from "../../components/Navigation";
import { Header } from "../../components/Header";
export const Overview = () => {
    return (
        <>
        <div class="bg-primary-black-page"> {/*Margin left and right might become a div later for cleaner code*/}
        
        <h1 class="ml-4 text-2xl text-font-off-white pt-2"> Welcome, Holden</h1> {/*Holden will be name variable*/}

        <div class="bg-primary-black mx-5 relative">
            <div class="ml-4 mt-3 py-2 flex justify-between items-center">
                <div>
                    <p class="text-base text-font-off-white">Overview</p>
                    <p class="text-2xl text-font-off-white">$8,987.32</p>
                    <p class="text-xs text-font-off-white">Contributions</p>
                </div>
                <span class="absolute top-3 right-3">
                    <img src="/images/InfoIcon.svg" alt="Informational Icon" class="max-w-3.5"></img>
                </span>
            </div>
        </div>
            <p class="flex items-center ml-4 text-xl text-font-off-white mt-2" >
                My Accounts <img src="/images/addcircle.svg" alt="Add Icon" class="mt"></img>
            </p>
        </div>
        </>
    );
  };
  