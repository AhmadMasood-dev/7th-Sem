package q3;

import java.io.*;
import java.net.*;

public class InterviewClient {

    private static final String HOST = "127.0.0.1";
    private static final int PORT = 6006;

    public static void main(String[] args) {
        try (
                Socket socket = new Socket(HOST, PORT);
                BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                BufferedReader user = new BufferedReader(new InputStreamReader(System.in))
        ) {
            String line;

            while ((line = in.readLine()) != null) {
                System.out.println("Server: " + line);

                // If server is asking a question, client should answer
                if (line.startsWith("Q: ")) {
                    System.out.print("Client: ");
                    String answer = user.readLine();
                    out.println(answer);
                }

                // End if server says completed or ended
                if (line.toLowerCase().contains("completed") || line.toLowerCase().contains("ended")) {
                    break;
                }
            }

        } catch (IOException ex) {
            System.err.println("Client error: " + ex);
        }
    }
}
