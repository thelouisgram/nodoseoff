import React, { useState, ChangeEvent, FormEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../store";
import {
  updateDrugDetails,
  updateSearchedWord,
} from "../../../../store/stateSlice";
import ExpandableText from "./ExpandableText";
import Loader from "@/Layout/dashboard/shared/Loader";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { sectionDetails } from "../../../../utils/search";
import { toast } from "sonner";

const Search = () => {
  const [searchedDrug, setSearchedDrug] = useState("");
  const [status, setStatus] = useState({
    isLoading: false,
    success: false,
    error: false,
  });

  const { drugDetails, searchedWord } = useSelector(
    (state: RootState) => state.app
  );
  const dispatch = useDispatch();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchedDrug(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchedDrug) {
      toast.error("Fill in the drug name");
      return;
    }
    setStatus({ isLoading: true, success: false, error: false });

    try {
      const response = await axios.get<any>(
        `https://api.fda.gov/drug/label.json?search=openfda.substance_name:${searchedDrug}`
      );

      setStatus({ isLoading: false, success: true, error: false });

      dispatch(updateSearchedWord(searchedDrug));
      dispatch(updateDrugDetails(response.data.results[0]));
    } catch (error) {
      setStatus({ isLoading: false, success: false, error: true });

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error("Axios Error:", axiosError.message);
        console.error("Response data:", axiosError.response?.data);
        console.error("Status code:", axiosError.response?.status);
      } else {
        console.error("Error fetching data:", error);
      }
      toast.error("No information on '" + searchedDrug + "' available");
    }
    setSearchedDrug("");
  };

  return (
    <div className="h-[100dvh] ss:pb-28 overflow-y-scroll w-full md:py-16 md:px-12 px-4 pt-10 pb-24 ss:p-10 text-navyBlue font-karla relative">
      <div className="mb-[28px]">
        <h1 className="text-[24px] ss:text-[32px] font-semibold font-montserrant ">
          Search
        </h1>
        <p className="text-[16px] text-[#718096]">
          Search for Drug Details Smartly!
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-1/2 bg-lightGrey rounded-[10px] flex items-center overflow-hidden gap-4 pr-4"
      >
        <input
          type="text"
          id="drug"
          name="drug"
          value={searchedDrug}
          onChange={handleInputChange}
          className="outline-none p-4 capitalize h-[56px] w-full bg-lightGrey"
          placeholder="Search for a Drug"
        />
        <button>
          <Image
            src="/assets/mobile-dashboard/search.png"
            alt="search"
            width={24}
            height={24}
          />
        </button>
      </form>
      <div className="w-full">
        {status.isLoading ? (
          <Loader />
        ) : status.success ? (
          <div className="mt-6 font-Inter flex flex-col gap-4">
            <div className="">
              <h1 className="text-[24px] ss:text-[32px] font-semibold capitalize">
                {searchedWord}
              </h1>
            </div>
            <div className="">
              <h1 className="text-[14px] font-bold">Route:</h1>
              <h1 className="text-[14px] ss:text-16px capitalize">
                {drugDetails.openfda.route.join(", ").toLowerCase()}
              </h1>
            </div>
            {sectionDetails.map(
              (section) =>
                drugDetails?.[section.key] && (
                  <div key={section.key} className="">
                    <h1 className="text-[14px] font-bold">{section.title}:</h1>
                    <h1 className="text-[14px] ss:text-16px">
                      <ExpandableText
                        text={
                          drugDetails?.[section.key]?.[0]
                            ?.split(" ")
                            .slice(section.startIndex)
                            .join(" ") || ""
                        }
                        limit={50}
                      />
                    </h1>
                  </div>
                )
            )}
            <div className="">
              <h1 className="text-[14px] font-bold">Source:</h1>
              <h1 className="text-[14px] ss:text-16px">OpenFDA</h1>
            </div>
            <p className="italic">
              Disclaimer: Do not rely on openFDA to make decisions regarding
              medical care. While we make every effort to ensure that data is
              accurate, you should assume all results are unvalidated.
            </p>
          </div>
        ) : (
          <div className="w-full h-[320px] flex gap-3 flex-col justify-center items-center">
            <Image
              src="/assets/no-results.png"
              width={60}
              height={60}
              alt="no results"
            />
            <h1 className="text-[#a7a7a7] text-[16px] font-Inter">
              Search for a drug to get started!
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
