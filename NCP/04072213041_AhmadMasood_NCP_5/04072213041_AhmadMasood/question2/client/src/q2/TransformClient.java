package q2;

import java.io.*;
import java.net.*;

public class TransformClient {
    private static final String HOST = "127.0.0.1";
    private static final int PORT = 4000;

    public static void main(String[] args) {
        String message;
        if (args.length > 0) {
            message = String.join(" ", args);
        } else {
            message = "Hello Ahmad"; 
        }

        try (
            Socket socket = new Socket(HOST, PORT);
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true)
        ) {
            out.println(message);

            String response = in.readLine();
            System.out.println("Sent     " + message);
            System.out.println("Received " + response);

        } catch (IOException ex) {
            System.err.println("Client error: " + ex);
        }
    }
}
