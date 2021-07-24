import React, { useEffect, useState } from "react";

import { Location, History } from "history";

import { parse, stringify } from "qs";
import axios from "axios";

import { debounce, TextField } from "@material-ui/core";
import {
  DataGrid,
  GridColumns,
  GridPageChangeParams,
  GridSortModel,
} from "@material-ui/data-grid";
import { DatePicker } from "@material-ui/pickers";

import { IEarthQuake } from "../../interfaces";

interface IEarthQuakesPageProps {
  history: History;
  location: Location;
}

const columns: GridColumns = [
  {
    field: "time",
    headerName: "Date",
    width: 130,
    valueFormatter: ({ value }) => (value as string).slice(0, 10),
    sortable: false,
    filterable: false,
  },
  {
    field: "title",
    headerName: "Title",
    width: 400,
    sortable: false,
    filterable: false,
  },
  { field: "magnitude", headerName: "Magnitude", width: 150 },
  { field: "significance", headerName: "Significance", width: 160 },
  {
    field: "info",
    headerName: "More Info",
    width: 300,
    sortable: false,
    filterable: false,
  },
];

export const EarthQuakesPage = (props: IEarthQuakesPageProps) => {
  const [earthQuakes, setEarthQuakes] = useState<IEarthQuake[]>([]);
  const [earthQuakesCount, setEarthQuakesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState(getParams(props));
  const [sortModel, setSortModel] = useState<GridSortModel>();

  useEffect(() => {
    setLoading(true);

    const params = getParams(props);
    setParams(params);

    const { sortBy, sortDirection } = params;

    if (sortBy && sortDirection) {
      setSortModel([{ field: sortBy, sort: sortDirection }]);
    }

    axios
      .get(`http://localhost:1234/earthQuakes?${stringify(params)}`)
      .then((response) => {
        setEarthQuakes(response.data);
        setLoading(false);

        const totalCountStr = response.headers["x-total-count"];
        const totalCount = Number.parseInt(totalCountStr);

        if (typeof totalCount === "number" && !isNaN(totalCount)) {
          setEarthQuakesCount(totalCount);
        }
      })
      .catch((_) => {
        // Show a nice toast to the user
      });
  }, [props, props.location.search]);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        alignSelf: "stretch",
        flexDirection: "column",
        padding: 16,
        paddingTop: 32,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <DatePicker
          value={params.startDate}
          onChange={handleDateChange(props, "startDate")}
          style={{ marginTop: 16 }}
        />
        <DatePicker
          value={params.endDate}
          onChange={handleDateChange(props, "endDate")}
          style={{ marginLeft: 16, marginTop: 16 }}
        />
        <TextField
          id="minMagnitude"
          label="Min Magnitude"
          value={params.minMagnitude}
          onChange={handleInputValueChange(
            props,
            params,
            setParams,
            "minMagnitude"
          )}
          style={{ marginLeft: 16 }}
        />
        <TextField
          id="minSignificance"
          label="Min Significance"
          value={params.minSignificance}
          onChange={handleInputValueChange(
            props,
            params,
            setParams,
            "minSignificance"
          )}
          style={{ marginLeft: 16 }}
        />
      </div>
      <DataGrid
        rows={earthQuakes}
        columns={columns}
        loading={loading}
        pagination={true}
        pageSize={params.take}
        rowCount={earthQuakesCount}
        paginationMode="server"
        onPageChange={handlePageChange(props)}
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange(props)}
        style={{ marginTop: 32 }}
      />
    </div>
  );
};

const DAYS_7 = 7 * 24 * 60 * 60 * 1000;

const getParams = (props: IEarthQuakesPageProps) => {
  const {
    take = 100,
    skip = 0,
    minSignificance = 0,
    minMagnitude = 0,
    startDate = new Date(new Date().getTime() - DAYS_7),
    endDate = new Date(),
    fullSearch,
    sortBy,
    sortDirection,
  } = parse(props.location.search);

  return {
    take,
    skip,
    minSignificance,
    minMagnitude,
    startDate,
    endDate,
    fullSearch,
    sortBy,
    sortDirection,
  };
};

type Params = ReturnType<typeof getParams>;

const changeUrl = (props: IEarthQuakesPageProps) => (queryParams: Object) => {
  props.history.push(`${props.location.pathname}?${stringify(queryParams)}`);
};

const handlePageChange =
  (props: IEarthQuakesPageProps) =>
  ({ page, pageSize }: GridPageChangeParams) => {
    const updatedParams = { ...getParams(props), skip: page * pageSize };

    changeUrl(props)(updatedParams);
  };

const handleSortModelChange =
  (props: IEarthQuakesPageProps) =>
  ([{ field: sortBy, sort: sortDirection }]: GridSortModel) => {
    const updatedParams = {
      ...getParams(props),
      skip: 0,
      sortBy,
      sortDirection,
    };

    changeUrl(props)(updatedParams);
  };

const debouncedUrlChange = debounce(
  (props: IEarthQuakesPageProps, url: string) => {
    props.history.push(url);
  },
  300
);

const handleDateChange =
  (props: IEarthQuakesPageProps, field: string) => (date: Date | null) => {
    const updatedParams = { ...getParams(props), skip: 0, [field]: date };

    changeUrl(props)(updatedParams);
  };

const handleInputValueChange =
  (
    props: IEarthQuakesPageProps,
    params: Params,
    setParams: React.Dispatch<Params>,
    field: string
  ) =>
  (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const updatedParams = { ...params, skip: 0, [field]: e.target.value };
    setParams(updatedParams);

    debouncedUrlChange(
      props,
      `${props.location.pathname}?${stringify(updatedParams)}`
    );
  };
