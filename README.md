# Geog777 Project1 Wisconsin Nitrate Levels and Cancer Rates

## Quick Rundown of Project 1 
Being given two datasets: the first polygons with the average cancer rates per census tract normalized by population, the second being well points locations with attached nitrate levels.
A third shapefile was added of census tract boundary line polygons.

Turf.js is used to perform various spatial operations.  

First, the datasets must be turned into Turf.js featureCollections.

interpolate is used to perform the IDW after the user input value for the distance exponent k is entered. 

This creates a grid of points over the area of Wisconsin with a diameter of 12 miles for each IDW point.  While testing the early stages of the app, the IDW point grid was added to a leaflet map to visualize.  Entering in the diameter of 12 resulted in the results of the choropleth visualization that was most similar to the raster image created during a test within ArcGISPro.

This route was chosen as a challenge to get the IDW values displayed as a choropleth within the census tract polygons.  It's not perfect, as there are many polygons that have an average value of 0, but it does feel easier for a layperson to interpret where the higher levels are actually located with regards to a particular county/census tract of interest.

collect is then used to take the IDW points and merge them to the census tract boundary line polygons.  This results in each census tract polygon containing an array of the IDW point values found within the polygon.  

featureEach  is used next to loop over the merged dataset and find the average for the IDW points within the census tract and centroid was used to attach this IDW nitrate mean value to a new centroid point within the polygon. 

collect is used again to merge (join) the polygons with the cancer rate data to the IDWmean centroid points.  This results in the census tract polygons with datasets for both the IDW nitrate mean and the cancer rate.  

Next, three arrays are created by iterating over this collection and pulling out the cancer rates, the IDWmean (converting undefined/Nan into a 0 value), pushing those values into the third array in [ x, y ] format that regression-js can read. 

regression-js is then passed the [ x, y ] formatted array to perform linear regression.  This results in an equation for the regression line which is displayed on the screen.  

Next, the regression result is iterated over and split into an array of x and an array of y values that statistics.js can use.

Statistics.js is then used to provide the correlation coefficient.  

Chart.js is then passed the [ x, y ] formatted regression points to create a Mixed chart with the scatter plot and the regression line.
 
