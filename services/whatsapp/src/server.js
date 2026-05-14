const express = require('express');
const { notifyBackend } = require('./webhook');

function startControlServer(sock, logoutCallback) {
    const app = express();
    app.use(express.json());

    // Endpoint to remotely logout/revoke connection
    app.post('/logout', async (req, res) => {
        try {
            console.log("Revoke request received from dashboard...");
            await sock.logout();
            if (logoutCallback) logoutCallback();
            res.json({ status: "success", message: "Logged out successfully" });
        } catch (err) {
            res.status(500).json({ status: "error", message: err.message });
        }
    });

    // Endpoint to check if service is alive
    app.get('/health', (req, res) => {
        res.json({ status: "alive" });
    });

    const PORT = process.env.CONTROL_PORT || 8001;
    app.listen(PORT, () => {
        console.log(`Control Server running on port ${PORT}`);
    });
}

module.exports = startControlServer;
