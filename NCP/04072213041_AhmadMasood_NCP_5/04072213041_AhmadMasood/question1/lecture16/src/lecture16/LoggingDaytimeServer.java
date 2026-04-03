package lecture16;

import java.io.*;
import java.net.*;
import java.util.Date;
import java.util.concurrent.*;
import java.util.logging.*;

public class LoggingDaytimeServer {
    public final static int PORT = 1313; // slide uses 13

    private final static Logger auditLogger = Logger.getLogger("requests");
    private final static Logger errorLogger = Logger.getLogger("errors");

    public static void main(String[] args) throws SecurityException, IOException {
        Handler handler = new FileHandler("test.txt", true);
        handler.setFormatter(new SimpleFormatter());
        auditLogger.addHandler(handler);
        errorLogger.addHandler(handler);

        ExecutorService pool = Executors.newFixedThreadPool(50);

        try (ServerSocket server = new ServerSocket(PORT)) {
            System.out.println("LoggingDaytimeServer listening on port " + PORT);

            while (true) {
                try {
                    Socket connection = server.accept();
                    auditLogger.info("Connection from " + connection.getRemoteSocketAddress());

                    Callable<Void> task = new DaytimeTask(connection);
                    pool.submit(task);

                } catch (IOException ex) {
                    errorLogger.log(Level.SEVERE, "accept error", ex);
                } catch (RuntimeException ex) {
                    errorLogger.log(Level.SEVERE, "unexpected error " + ex.getMessage(), ex);
                }
            }
        } catch (IOException ex) {
            errorLogger.log(Level.SEVERE, "Couldn't start server", ex);
        } catch (RuntimeException ex) {
            errorLogger.log(Level.SEVERE, "Couldn't start server: " + ex.getMessage(), ex);
        }
    }

    private static class DaytimeTask implements Callable<Void> {
        private final Socket connection;

        DaytimeTask(Socket connection) {
            this.connection = connection;
        }

        public Void call() {
            try {
                Writer out = new OutputStreamWriter(connection.getOutputStream());
                Date now = new Date();
                out.write(now.toString() + "\r\n");
                out.flush();
                auditLogger.info("Served time to " + connection.getRemoteSocketAddress());
            } catch (IOException ex) {
                errorLogger.log(Level.SEVERE, "task error", ex);
            } finally {
                try {
                    connection.close();
                } catch (IOException ignored) {
                }
            }
            return null;
        }
    }
}
