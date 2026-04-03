package q4;

import java.io.*;
import java.net.*;
import java.util.concurrent.*;

public class PortScanner {

    // Defaults (you can pass from command line too)
    private static final String DEFAULT_HOST = "127.0.0.1";
    private static final int DEFAULT_START_PORT = 1;
    private static final int DEFAULT_END_PORT = 1024;

    // Multithreading settings
    private static final int THREADS = 200;      // number of threads in pool
    private static final int TIMEOUT_MS = 200;   // socket connect timeout (ms)

    public static void main(String[] args) {
        String host = (args.length > 0) ? args[0] : DEFAULT_HOST;
        int startPort = (args.length > 1) ? Integer.parseInt(args[1]) : DEFAULT_START_PORT;
        int endPort = (args.length > 2) ? Integer.parseInt(args[2]) : DEFAULT_END_PORT;

        if (startPort < 1 || endPort > 65535 || startPort > endPort) {
            System.out.println("Usage: java q4.PortScanner <host> <startPort> <endPort>");
            System.out.println("Example: java q4.PortScanner 127.0.0.1 1 1024");
            return;
        }

        System.out.println("Scanning host: " + host);
        System.out.println("Port range: " + startPort + " to " + endPort);
        System.out.println("Threads: " + THREADS + ", Timeout: " + TIMEOUT_MS + "ms\n");

        ExecutorService pool = Executors.newFixedThreadPool(THREADS);

        long startTime = System.currentTimeMillis();

        // Submit each port scan as a separate task (multithreading)
        for (int port = startPort; port <= endPort; port++) {
            final int p = port;
            pool.submit(() -> scanPort(host, p));
        }

        // Stop accepting new tasks
        pool.shutdown();

        try {
            // Wait for all threads to finish
            pool.awaitTermination(5, TimeUnit.MINUTES);
        } catch (InterruptedException e) {
            System.err.println("Scan interrupted: " + e);
        }

        long endTime = System.currentTimeMillis();
        System.out.println("\nScan finished in " + (endTime - startTime) + " ms");
    }

    private static void scanPort(String host, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), TIMEOUT_MS);
            System.out.println("OPEN  : " + port);
        } catch (IOException ignored) {
            // closed/filtered port: ignore
        }
    }
}
