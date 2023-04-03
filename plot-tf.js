const COHERENCE_CSV = "//s3.amazonaws.com/appforest_uf/f1613596836165x279561100861491780/behringer%20eurolive%20112%201m.csv";
const CSV2 = ["https://s3.amazonaws.com/appforest_uf/f1645583701569x371417135689216830/dV-DOSC_DV_LO_100.csv","https://s3.amazonaws.com/appforest_uf/f1599537508859x903709677435187000/d%26b%20E8%20native%202.5m.csv"];
const INVERT_POLARITY = false;				// default: false
const COHERENCE_THRESHOLD = 0;		// default: 0.0
const DELAY_MS = 0;   						// default: 0.0

// Add more urls to this array to display them.
// First URL is the "main" csv that gets the settings applied
const CSV_URLS = ["//s3.amazonaws.com/appforest_uf/f1613596836165x279561100861491780/behringer%20eurolive%20112%201m.csv", "https://s3.amazonaws.com/appforest_uf/f1649101764323x463244074655706300/BassBoss%20SSP118-MKII%20XO%20100%202.06m%2034.10ms.txt"];
const ADDITIONAL_COLORS = ["red", "orange", "yellow", "green", "indigo", "violet"];

//
// Magnitude/Coherence
//
fetchMultipleCsvs(CSV_URLS)
    .then((magnitudeCsvs) => {
        // Generate graph
        Highcharts.chart("magnitudeCoherenceGraph", {
            chart: {
                type: "line",
                zoomType: "x",
                isZoomed: false,
                alignTicks: false,
            },
            title: {
                text: null,
            },
            xAxis: {
                type: "logarithmic",
                min: 15,
                max: 16000,
                //allowDecimals: false,
                tickPositions: [
                    15,
                    31,
                    62,
                    125,
                    250,
                    500,
                    1000,
                    2000,
                    4000,
                    8000,
                    16000,
                ].map((v) => Math.log10(v)),
                gridLineWidth: 0.5,
                //crosshair: false
                },
            yAxis: [
                {
                    min: -30,
                    max: 30,
                    tickInterval: 10,
                    //endOnTick: false,
                    title: {
                        text: "Magnitude",
                        reserveSpace: false,
                    },
                    labels: {
                        format: "{value}dB",
                    },
                    //crosshair: false
                },
                {
                    // Secondary yAxis
                    title: {
                        text: "Coherence",
                        reserveSpace: false,
                    },
                    labels: {
                        align: "right",
                        formatter: function () {
                            return this.value * 100 + "%";
                        },
                        //format: '{value}%',
                        x: -4,
                        y: -2,
                    },
                    opposite: true,
                    min: 0,
                    max: 1,
                    tickInterval: 0.5,
                    gridLineWidth: 0,
                    height: '50%'
                },
            ],
            //tooltip: {
            //            split: true,
            //            pointFormat: '{series.name} {point.y:.2f}',
             //           valueDecimals: 0
               //     },
            legend: {
                enabled: false,
            },
            data: {
                rows: mergeCsvs(magnitudeCsvs),
                firstRowAsNames: false,
            },
            series: makeMagnitudeSeries(magnitudeCsvs.length),
        });

        reflowCharts();

    })
    .catch((err) => {
        // Handle errors
        console.log(err);
        document
            .getElementById("magnitudeCoherenceGraph")
            .classList.add("hidden");

        reflowCharts();
    });

function makeMagnitudeSeries(numberOfTraces)
{
    let series = [
        {
            name: "Magnitude",
            yAxis: 0,
            color: "blue",
            connectNulls: true
        },
        {
            visible: false,
        },
        {
            name: "Coherence",
            yAxis: 1,
            color: "red",
            connectNulls: true
        }, 
        {
            visible: false,
        },
    ];
    for(let i = 1; i < numberOfTraces; i++)
    {
        const colorIndex = i % ADDITIONAL_COLORS.length;
        series = series.concat([
            {
                name: `Magnitude ${i + 1}`,
                yAxis: 0,
                color: ADDITIONAL_COLORS[colorIndex],
                connectNulls: true
            },
            {
                visible: false,
            },
            {
                name: `Coherence ${i + 1}`,
                yAxis: 1,
                color: ADDITIONAL_COLORS[colorIndex],
                connectNulls: true
            }, 
        ])
    }
    return series;
}

//
// Phase
//
fetchMultipleCsvs(CSV_URLS)
    .then((phaseCsvs) => {
        // Generate graph
        Highcharts.chart("phaseGraph", {
            chart: {
                type: "line",
                zoomType: "x",
                isZoomed: false,
                alignTicks: false,
            },
            title: {
                text: null,
            },
            xAxis: {
                type: "logarithmic",
                min: 15,
                max: 16000,
                tickPositions: [
                    15,
                    31,
                    62,
                    125,
                    250,
                    500,
                    1000,
                    2000,
                    4000,
                    8000,
                    16000,
                ].map((v) => Math.log10(v)),
                gridLineWidth: 0.5,
                //crosshair: {enabled: true}
            },
            yAxis: [
                {
                    min: -180,
                    max: 180,
                    tickInterval: 60,
                    title: {
                        text: "Phase",
                        reserveSpace: false,
                    },
                    labels: {
                        format: "{value}º",
                    },
                    //crosshair: {enabled: true}
                },
            ],
            //tooltip: {
              //          split: true,
                //        pointFormat: '{series.name} {point.y:.2f}º' 
                  //  },
            legend: {
                enabled: false,
            },
            data: {
                rows: mergeCsvs(phaseCsvs),
                firstRowAsNames: false,
            },
            series: makePhaseSeries(phaseCsvs.length),
        });

        reflowCharts();

    })
    .catch((err) => {
        // Handle errors
        document.getElementById("phaseGraph").classList.add("hidden");
        reflowCharts();
        console.log(err);
    });

function makePhaseSeries(numberOfTraces)
{
    let series = [
        {
            visible: false,
        },
        {
            name: "Phase",
            visible: true,
            color: "blue",
            yAxis: 0,
            connectNulls: true
        },
        {
            visible: false,
        },
        {
            name: "Phase Original",
            visible: true,
            color: "gray",
            dashStyle: 'shortdot',
            yAxis: 0,
            connectNulls: true
        },
    ]

    for(let i = 1; i < numberOfTraces; i++)
    {
        const colorIndex = (i) % ADDITIONAL_COLORS.length;
        series = series.concat([
            {
                visible: false,
            },
            {
                name: `Phase ${i + 1}`,
                visible: true,
                color: ADDITIONAL_COLORS[colorIndex],
                yAxis: 0,
                connectNulls: true
            },
            {
                visible: false,
            },
        ]);
    }
    return series;
}

function reflowCharts() {
    Highcharts.charts.forEach((chart) => {
        chart.reflow();
    });
}

function fetchMultipleCsvs(urls)
{
    return Promise.all(urls.map(url => fetch(url).then(csvFileIntoString)));
}

function csvFileIntoString(fetchResult)
{
    // Check if the file extension is CSV
    // I encountered CSV files without this header, so I have commented it out for now
    // if (fetchResult.headers.get("Content-Type") !== "text/csv") 
    // {
    //     throw new Error("Not a CSV file");
    // }

    // Parse a CSV string from the response
    return fetchResult.text();
}

// Merges multiple csvs into one, adding subsequent csv values into new columns, rows sorted by frequency
function mergeCsvs(csvs)
{
    const parsedCsvs = csvs.map((csv, index) => {
        if(index === 0){
            return processCsv(csv);
        }
        else{
            // for each row, move relevant columns to new columns for each csv
            const parsed = parseCsvIntoRows(csv);
            // starting column for this csv. col 4 is phaseOriginal column for main trace
            const startingCol = 4 + (3 * (index - 1));

            for(let i = 0; i < parsed.length; i++)
            {
                var cols = parsed[i];
                // column 0, frequency, should stay in the same place for all rows
                cols[startingCol + 1] = cols[1];
                cols[startingCol + 2] = cols[2];
                cols[startingCol + 3] = cols[3];
                cols[1] = null;
                cols[2] = null;
                cols[3] = null;
                parsed[i] = cols;
            }
            return parsed
        }
    })
    // put all of the rows of all the csvs into one csv
    const concatenated = parsedCsvs.reduce((acc, next) => acc.concat(next), []);

    // sort rows by frequency, ascending
    const sorted = concatenated.sort((a, b) => a[0] - b[0]);

    // merge rows with same frequencies into one row
    const deduped = dedupeFrequencies(sorted);

    //console.log(deduped);
    
    return deduped;
}

function dedupeFrequencies(sortedCsv)
{
    // Takes in a csv with rows sorted by frequency (column 0)
    // Merges any rows that have the same frequency

    // iterate in reverse to avoid breaking the for loop when we remove rows
    for(let i = sortedCsv.length - 1; i >= 1; i--)
    {
        const row = sortedCsv[i];
        const prevRow = sortedCsv[i-1];
        if(row[0] === prevRow[0]) // if frequencies are the same
        {
            // copy non-null columns from this row to previous row
            for(let j = 1; j < row.length; j++)
            {
                if(row[j] !== null && row[j] !== undefined)
                {
                    prevRow[j] = row[j];
                }
            }
            sortedCsv[i-1] = prevRow;
            sortedCsv.splice(i, 1);
        }
    }
    return sortedCsv;
}

// Apply settings to modify CSV. Only gets run on first viewed csv
function processCsv(csvString) {
    var rows = parseCsvIntoRows(csvString);
  
    for (var i = 0; i < rows.length; i++) {
        var cols = rows[i];
        var phase = cols[2];
        var phaseOriginal = cols[2];
        var frequency = cols[0];

        if (INVERT_POLARITY) {
            phase = phase + 180;
            cols[2] = wrapTo180(phase);
            //cols[4] = phaseOriginal;
        }

        if (DELAY_MS != 0.0 ) {
            phase = phase + (frequency * 360.0 * (DELAY_MS *-1 / 1000.0));
            cols[2] = wrapTo180(phase);
            //cols[4] = phaseOriginal;
        }

        // Coherence
        if (cols[3] < COHERENCE_THRESHOLD) {
            cols[1] = null; 
            cols[2] = null;
            cols[3] = null;
            cols[4] = null;
        }

        rows[i] = cols;

    }
    return rows;
}

function parseCsvIntoRows(csvString)
{
    // INPUT: CSV file as a string (not a URL)
    // OUTPUT: Array of row arrays

    const data = Papa.parse(csvString, {
        dynamicTyping: true,        // Convert all strings to numbers where appropriate
        skipEmptyLines: "greedy",    // Skip all lines that don't have any content - this would cause Highcharts to error
    });
    return data.data.slice(2);      // Remove the first two lines of data (title of graph and column headers)

}

// https://stackoverflow.com/questions/4633177/c-how-to-wrap-a-float-to-the-interval-pi-pi

function wrapTo180(ang) {
    return phasemod(ang + 180.0, 360.0) - 180.0;
}

const _PI = Math.PI;
const _TWO_PI = 2 * Math.PI;

function phasemod(x, y) 
{
    if (0.0 == y)
        return x;

    var m = x - y * Math.floor(x/y);

    // handle boundary cases resulted from floating-point cut off:

    if (y > 0)              // modulo range: [0..y)
    {
        if (m >= y)           // Mod(-1e-16             , 360.    ): m= 360.
            return 0;

        if (m < 0)
        {
            if (y+m == y)
                return 0  ; // just in case...
            else
                return y + m; // Mod(106.81415022205296 , _TWO_PI ): m= -1.421e-14 
        }
    }
    else                    // modulo range: (y..0]
    {
        if (m <= y)           // Mod(1e-16 , -360.   ): m= -360.
            return 0;

        if (m > 0)
        {
            if (y + m == y)
                return 0  ; // just in case...
            else
                return y + m; // Mod(-106.81415022205296, -_TWO_PI): m= 1.421e-14 
        }
    }

    return m;
}