/**
 * This java servlet class retrieves data from the postgreSQL database and produces a JSON array as the result.
 */

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.io.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.*;
import javax.servlet.http.*;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

@WebServlet(name = "RetrieveCatalogue")
public class RetrieveCatalogue extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // Response set as json
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();

        // Json arrays for database tables
        JSONArray dbdata_manufacturer = new JSONArray();
        JSONArray dbdata_product_type = new JSONArray();
        JSONArray dbdata_product = new JSONArray();
        JSONArray dbdata_product_dimension = new JSONArray();

        // Json array to store the other arrays
        JSONArray dbdata_catalogue = new JSONArray();

        try {

            // Establish Database Connection
            Connection connection = DatabaseConnection.getConnection();
            Statement statement = connection.createStatement();

            // Select all data from manufacturer table
            ResultSet resultSet = statement.executeQuery("select * from manufacturer");
            while (resultSet.next()) {
                JSONObject record = new JSONObject();

                // Inserting key-value pairs into the json object
                record.put("id", resultSet.getInt("id"));
                record.put("name", resultSet.getString("name"));
                dbdata_manufacturer.add(record);

            }

            // Select all data from product_type table
            resultSet = statement.executeQuery("select * from product_type");
            while (resultSet.next()) {
                JSONObject record = new JSONObject();

                // Inserting key-value pairs into the json object
                record.put("id", resultSet.getInt("id"));
                record.put("name", resultSet.getString("name"));
                record.put("manufacturer_id", resultSet.getInt("manufacturer_id"));
                dbdata_product_type.add(record);
            }

            // Select all data from product table
            resultSet = statement.executeQuery("select * from product");
            while (resultSet.next()) {
                JSONObject record = new JSONObject();

                // Inserting key-value pairs into the json object
                record.put("id", resultSet.getInt("id"));
                record.put("name", resultSet.getString("name"));
                record.put("image", resultSet.getString("image"));
                record.put("product_type_id", resultSet.getInt("product_type_id"));
                dbdata_product.add(record);
            }

            // Select all data from product_dimension table
            resultSet = statement.executeQuery("select * from product_dimension");
            while (resultSet.next()) {
                JSONObject record = new JSONObject();

                // Inserting key-value pairs into the json object
                record.put("id", resultSet.getInt("id"));
                record.put("length", resultSet.getInt("length"));
                record.put("width", resultSet.getInt("width"));
                record.put("product_id", resultSet.getInt("product_id"));
                dbdata_product_dimension.add(record);
            }

            // Add all arrays to the dbdata_catalogue
            dbdata_catalogue.add(dbdata_manufacturer);
            dbdata_catalogue.add(dbdata_product_type);
            dbdata_catalogue.add(dbdata_product);
            dbdata_catalogue.add(dbdata_product_dimension);

            // Close database connection
            connection.close();
            out.print(dbdata_catalogue);

        } catch (Exception e) {
            out.print("Database connection not successful");
        }
    }
}
