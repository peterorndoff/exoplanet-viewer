

    // Scaling factor for galactic position and lightyear conversion.

    ls = d3.scaleLinear() // Linear Scaling for Lightyear positioning
        .domain([0, 10]) // domain from 0 Ly to 50,000 Ly
        .range([0, 1]); // Plotting range from 0, 

    var pc_ly = function(x) { // Converts Parsecs to Lightyears.
        x = x*((1/3.26156)) // 1 Ly = 3.26 parsec's
        return x }
    

    // For Viewing of Planets/ animation potential.


    const exo_system_container = d3.select('#exo_system_container')
        .attr('class', 'exo_system_container')

    var star_container = d3.select('#star_container')
        .attr('class', 'star_container')
        .append('svg')
        .attr('viewBox', '0 0 250 100')
        
        // Make the circle append variable
        // depending on single, binary, trinary system.
        // Need to figure out how to color each star.

        .append('circle')
            .attr('cx', 80) // Variable.
            .attr('cy', 55)
            .attr('r', 12) // variable.
    
    var planet_container = d3.select('#planet_container')
        .attr('class', 'planet_container')
        .append('svg')
        .attr('viewBox', '0 0 500 100')

        // Linear scaling for # of planets in system

        .append('circle')
            .attr('cx', 50) // variable
            .attr('cy', 55) // Static
            .attr('r', 3) // variable
            .style('fill', 'black') // variable

    var text_container = d3.select('#text_container')
        .attr('class', 'text_container')


    var planet_tooltip = d3.select('#planet_tooltip')
        .attr("class", "planet_tooltip")
        .style("opacity", 0)

    var exo_viewer = d3.select('#exo_viewer')
        .append('svg')
        .attr('viewbox', '0 0 200 200')

        .append('circle')
            .attr('cx', 125)
            .attr('cy', 90)
            .attr('r', 3)
            .style('fill', 'rgb(141, 213, 145)')

    var search_box = d3.select('#search-dropdown-container')
        .attr("class", 'search-box-container')


    // Main SVG generation.


    d3.select("#milky_way")
        .append("svg") // Creates SVG. 
        //.attr("width", '100%')
        //.attr("height", '100%')
        .attr('viewBox', '0 80 1920 1080')// Min-x, Min-y, width, height
        
    svg = d3.select('svg') // Selects SVG
    g = svg.append('g')

    g.append('svg:image') // Appends Milky_way as image onto SVG.
        .attr('width', 1920)
        .attr('height', 1080)
        .attr("xlink:href", "PIA10748.jpg")
        .attr('opacity', 0.95)
        
    d3.csv("from_exo_confirmed.csv").then(function(data) {
        
        data.forEach(function(d) {
            
            // Positional Data
            d.ra = +d.ra*(Math.PI/180) // Converting degrees to radians.
            d.dec = +d.dec*(Math.PI/180) // Converting Degrees to radians
            // Discovery Information
            d.discoverymethod = d.discoverymethod // Discovery Method
            d.disc_year = d.disc_year // Discovery year
            d.disc_facility = d.disc_facility // Discovery facility.
            // Planetary Information.
            d.pl_name = d.pl_name // Grabbing name of Planet
            d.pl_orbper = d.pl_orbper // Oribtal period of planet in days.
            d.orbsmax = d.orbsmax // Orbital semi-major axis in AU.
            d.pl_rade = d.pl_rade // Planet Radius in Earth Radius.
            d.pl_bmasse = d.pl_bmasse // Planet mass in Earth Mass.
            d.pl_orbeccen = d.pl_orbeccen // Planet Orbital eccentricity.
            d.pl_eqt = d.pl_eqt // Planet Equailibrium Temperature in K

            // Solar System information.
            d.sy_snum = d.sy_snum // Number of stars in system.
            d.pnum = d.pnum // Number of planets in system.

            // Host Star information.
            d.hostname = d.hostname // Star name.
            d.st_spectype = d.st_spectype // Stellar spectral type.
            d.st_teff = d.st_teff // Stellar temperature in K.
            d.st_rad = d.st_rad // Stellar radius in Solar Radii.
            d.st_mass = d.st_mass // Stellar mass in Solar mass.
            d.st_logg = d.st_logg // Stellar surface gravity in log10(cm/s**2)

        });

        var exo_planets = g.selectAll('g') // Appends g elements to SVG.
            .data(data)
            .enter()
            .append('g')
            .attr("transform", function(d, i) {
                        return "translate(960,748)" ;}) // Translates initial position of 

            .append("circle") //  Styling & Positional calculation.
                
                //.text(function(d){return "Planet:"+d.pl_name+"\nAge:"+d.age;})
                
                .attr('planet_name', function(d) {
                    return d.pl_name
                })
                
                .attr('distance', function(d) {
                    return d.sy_dist
                })

                .attr('pl_orb_radius', function(d) {
                    return d.orbsmax
                })

                .attr('pl_radius', function(d) {
                    return d.pl_rade
                })

                .attr('pl_temp', function(d) {
                    return d.pl_eqt
                })

                .attr('disc_method', function (d) {
                    return d.discoverymethod
                })

                .attr('disc_year', function (d) {
                    return d.disc_year
                })

                .attr('disc_facility', function (d) {
                    return d.disc_facility
                })

                .attr('star_name', function (d) {
                    return d.hostname
                })

                .attr('star_radius', function (d) {
                    return d.st_rad
                })

                .attr("cx", function(d,i) { // X axis - g element.
                    // X = r*cos(theta) 
                    // (d.sy_dist*0.2/10)*Math.sin(d.glat*(180/Math.PI))*Math.cos(d.glon*(180/Math.PI))

                    d.sy_dist = +pc_ly(d.sy_dist) // Converting to Lightyears
                    d.sy_dist = +ls(d.sy_dist)

                    return d.sy_dist*Math.cos(d.dec)*Math.cos(d.ra) ;})
                
                .attr("cy", function(d,i) { // Y axis - g element
                    // Y = r*sin(theta)
                    // (d.sy_dist*0.2/10)*Math.sin(d.glat*(180/Math.PI))*Math.sin(d.glon*(180/Math.PI))
                    return d.sy_dist*Math.cos(d.dec)*Math.sin(d.ra) ;})

                .attr("r", 1)
                    
                .on('mouseover', function (d, i) {


                    // System Tooltip Information.

                    d3.select(this).transition() //Selection radius increase
                        .duration('250')
                        .attr("r", 1.2);

                    planet_tooltip.transition() // Tooltip transition into visibility.
                        .duration('250')
                        .style("opacity", 1)
                        .style('visibility', 'visible')

                    //planet_tooltip
                      //  .style("left", (event.pageX + 20) + "px")
                        //.style("top", (event.pageY + - 40) + "px");
                    
                    planet_tooltip.select('#planet_name')
                        .html(d3.select(this).attr('planet_name'))
                    
                    planet_tooltip.select('radius')
                        .html(d3.select(this).attr('pl_radius'))

                    planet_tooltip.select('distance')
                        .html(d3.select(this).attr('distance'))

                    planet_tooltip.select('surface_temp')
                        .html(d3.select(this).attr('pl_temp'))

                    planet_tooltip.select('disc_method')
                        .html(d3.select(this).attr('disc_method'))

                    planet_tooltip.select('disc_year')
                        .html(d3.select(this).attr('disc_year'))

                    planet_tooltip.select('disc_facility')
                        .html(d3.select(this).attr('disc_facility'))


                    // Exo-System container
                    

                    text_container.select('#star_name')
                        .html(d3.select(this).attr('star_name'))

                    text_container.select('#planet_name')
                        .html(d3.select(this).attr('pl_temp'))


                    // Draw Star/Planet's here.
                    
                    // Updates Stellar information.

                    // Need to formulate a radius for both of these.
                    // Scaling is off, Planet is bigger than star in some cases.
                    // When star radius isn't determined use a scaling factor
                    // so that visualization dimensions are relatively accurate.

                    if (d3.select(this).attr('pl_radius') > 0) {
                        d3.select('#exo_viewer')
                        .select('circle').attr('r', d3.select(this).attr('pl_radius')*3)
                    }

                    // Updates Planet information.
                
                })


                .on('mouseout', function (d, i) {
                    
                        d3.select(this).transition()
                                .duration('250')
                                .attr("r", 1);

                        planet_tooltip.transition()
                                .style("opacity", 0)
                                .duration('500')
                                .style('visibility', 'hidden')

                        })
    
    });
        

    const handleZoom = function (e) {
        g.attr('transform', e.transform);
        //g.selectAll('circle').attr('r', 1.5 - (e.transform.k/25))
     }
    const zoom = d3.zoom()
        .scaleExtent([0.8, Infinity])
        .translateExtent([[0,0],[1920,1200]])
    
    //.translateExtent([1920,1080])
    .on('zoom', handleZoom);

    d3.select('svg')
    .call(zoom); 

