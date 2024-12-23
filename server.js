const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Initialize SQLite database
const db = new sqlite3.Database('./services.db', (err) => {
    if (err) {
        console.error('Failed to connect to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create or initialize the table
db.run(`
    CREATE TABLE IF NOT EXISTS services (
        name TEXT PRIMARY KEY,
        version INTEGER DEFAULT 0
    )
`, () => {
    db.run(`INSERT OR IGNORE INTO services (name) VALUES ('service_name')`);
});

// Helper function to format version
function formatVersion(version) {
    const major = Math.floor(version / 100); // Major: Every 100
    const minor = Math.floor((version % 100) / 10); // Minor: Every 10
    const patch = version % 10; // Patch: Remaining
    return `${major}.${minor}.${patch}`;
}

// API endpoint
app.get('/:serviceName', (req, res) => {
    const serviceName = req.params.serviceName;

    db.run(
        `UPDATE services SET version = version + 1 WHERE name = ?`,
        [serviceName],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            db.get(`SELECT version FROM services WHERE name = ?`, [serviceName], (err, row) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else if (!row) {
                    res.status(404).json({ error: `Service '${serviceName}' not found.` });
                } else {
                    res.json({ serviceName, version: formatVersion(row.version) });
                }
            });
        }
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
