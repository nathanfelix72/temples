let express = require("express");

let app = express();

let path = require("path");

let security = false;

const port = 5000;

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));

const knex = require("knex") ({
    client : "pg",
    connection : {
        host : "localhost",
        user : "postgres",
        password : "Meqn22ps8!",
        database : "templeproject",
        port : 5432
    }
});

// Route to display Pokemon records
app.get('/', (req, res) => {
    const { search, temple_name, status, dedication_date_start, dedication_date_end,
        state, country_name, announcement_date_start, announcement_date_end, groundbreaking_date_start,
        groundbreaking_date_end, rededication_date_start, rededication_date_end, second_rededication_date_start,
        second_rededication_date_end, dedicator_name, housing, visitor_center, distribution_center, prophet_name, 
        angel_moroni, attachment_type, instruction_room_count_max, instruction_room_count_min, 
        sealing_room_count_max, sealing_room_count_min, font_count_max, font_count_min, sq_feet_max, sq_feet_min, 
        acreage_max, acreage_min, stake_count_max, stake_count_min, district_count_max, district_count_min, 
        elevation_feet_max, elevation_feet_min, elevation_meters_max, elevation_meters_min, spire_count_min, 
        spire_count_max } = req.query;

    knex('temples')
        .leftJoin('countries', 'temples.country_id', '=', 'countries.country_id')
        .leftJoin('dedication_status', 'temples.dedication_status_id', 'dedication_status.dedication_status_id')
        .leftJoin('prophets', 'temples.prophet_dedication_id', 'prophets.prophet_id')
        .leftJoin('dedicators', 'temples.dedicator_id', 'dedicators.dedicator_id')
        .leftJoin('attachment', 'temples.attachment_id', 'attachment.attachment_id')
        .select(
            'temples.temple_name',
            'dedication_status.status',
            'temples.dedication_date',
        )
        .modify(queryBuilder => {
            if (search) {
                queryBuilder.where('temples.temple_name', 'ilike', `%${search}%`);
            }
            if (temple_name && temple_name !== "") {
                queryBuilder.where('temples.temple_name', 'ilike', `%${temple_name}%`);
            }
            if (status && status !== "") {
                queryBuilder.where('dedication_status.status', 'ilike', `%${status}%`);
            }
            if (dedication_date_start && dedication_date_end) {
                queryBuilder.whereBetween('dedication_date', [dedication_date_start, dedication_date_end]);
            }
            if (state && state !== "") {
                queryBuilder.where('temples.state', 'ilike', `%${state}%`);
            }
            if (country_name && country_name !== "") {
                queryBuilder.where('countries.country_name', 'ilike', `%${country_name}%`);
            }
            if (announcement_date_start && announcement_date_end) {
                queryBuilder.whereBetween('announcement_date', [announcement_date_start, announcement_date_end]);
            }
            if (groundbreaking_date_start && groundbreaking_date_end) {
                queryBuilder.whereBetween('groundbreaking_date', [groundbreaking_date_start, groundbreaking_date_end]);
            }
            if (rededication_date_start && rededication_date_end) {
                queryBuilder.whereBetween('rededication_date', [rededication_date_start, rededication_date_end]);
            }
            if (second_rededication_date_start && second_rededication_date_end) {
                queryBuilder.whereBetween('second_rededication_date', [second_rededication_date_start, second_rededication_date_end]);
            }
            if (dedicator_name && dedicator_name !== "") {
                queryBuilder.where('dedicators.dedicator_name', 'ilike', `%${dedicator_name}%`);
            }
            if (housing) {
                queryBuilder.where('temples.housing', true);
            }
            if (visitor_center) {
                queryBuilder.where('temples.visitor_center', true);
            }
            if (distribution_center) {
                queryBuilder.where('temples.distribution_center', true);
            }
            if (prophet_name && prophet_name !== "") {
                queryBuilder.where('prophets.prophet_name', 'ilike', `%${prophet_name}%`);
            }
            if (instruction_room_count_min && instruction_room_count_max) {
                queryBuilder.whereBetween('temples.instruction_room_count', [instruction_room_count_min, instruction_room_count_max]);
            }
            if (sealing_room_count_min && sealing_room_count_max) {
                queryBuilder.whereBetween('temples.sealing_room_count', [sealing_room_count_min, sealing_room_count_max]);
            }
            if (font_count_min && font_count_max) {
                queryBuilder.whereBetween('temples.font_count', [font_count_min, font_count_max]);
            }
            if (sq_feet_min && sq_feet_max) {
                queryBuilder.whereBetween('temples.sq_feet', [sq_feet_min, sq_feet_max]);
            }
            if (acreage_min && acreage_max) {
                queryBuilder.whereBetween('temples.acreage', [acreage_min, acreage_max]);
            }
            if (stake_count_min && stake_count_max) {
                queryBuilder.whereBetween('temples.stake_count', [stake_count_min, stake_count_max]);
            }
            if (district_count_min && district_count_max) {
                queryBuilder.whereBetween('temples.district_count', [district_count_min, district_count_max]);
            }
            if (elevation_feet_min && elevation_feet_max) {
                queryBuilder.whereBetween('temples.elevation_feet', [elevation_feet_min, elevation_feet_max]);
            }
            if (elevation_meters_min && elevation_meters_max) {
                queryBuilder.whereBetween('temples.elevation_meters', [elevation_meters_min, elevation_meters_max]);
            }
            if (spire_count_min && spire_count_max) {
                queryBuilder.whereBetween('temples.spire_count', [spire_count_min, spire_count_max]);
            }
            if (angel_moroni) {
                queryBuilder.where('temples.angel_moroni', true);
            }
            if (attachment_type && attachment_type !== "") {
                queryBuilder.where('attachment.attachment_type', 'ilike', `%${attachment_type}%`);
            }
        })
        .orderBy('temples.temple_name')
        .then(temples => {
            res.render('index', { temples, security, search });
        })
        .catch(error => {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
        });
});


app.listen(port, () => console.log("Listening"));