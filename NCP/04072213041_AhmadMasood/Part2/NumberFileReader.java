import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class NumberFileReader {

    // b) Read numbers from file into int[]
    public static int[] readFromFile(String filename) {
        List<Integer> numbers = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (!line.isEmpty()) {
                    try {
                        int value = Integer.parseInt(line);
                        numbers.add(value);
                    } catch (NumberFormatException e) {
                        System.out.println("Skipping invalid number: " + line);
                    }
                }
            }
        } catch (IOException e) {
            System.out.println("Error reading from file: " + filename);
            e.printStackTrace();
        }

        int[] data = new int[numbers.size()];
        for (int i = 0; i < numbers.size(); i++) {
            data[i] = numbers.get(i);
        }

        System.out.println("Read " + data.length + " numbers from file: " + filename);
        return data;
    }
}
