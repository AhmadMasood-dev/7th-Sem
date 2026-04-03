import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class RandomNumberGenerator {

    //Write 1000 random numbers (or any count) to file using character stream
    public static void generateToFile(String filename, int count, int min, int max) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filename))) {
            for (int i = 0; i < count; i++) {
                int value = (int) (Math.random() * ((max - min) + 1) + min);
                writer.write(Integer.toString(value));
                writer.newLine(); // one number per line
            }
            System.out.println("Generated " + count + " random numbers into file: " + filename);
        } catch (IOException e) {
            System.out.println("Error writing to file: " + filename);
            e.printStackTrace();
        }
    }
}
