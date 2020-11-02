/**
 * This java file retrieves data from the postgreSQL database and produces a JSON array as the result.
 */

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import java.io.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.*;
import javax.servlet.http.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

@WebServlet(name = "retrieveCatalogue")
public class retrieveCatalogue extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        PrintWriter out = response.getWriter();

        // Response set as json
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Json arrays for database tables
        JSONArray dbdata_manufacturer = new JSONArray();
        JSONArray dbdata_product_type = new JSONArray();
        JSONArray dbdata_product = new JSONArray();

        // Json array to store the other arrays
        JSONArray dbdata_catalogue = new JSONArray();

        try
        {
            // PostgreSQL connection to the database
            Class.forName("org.postgresql.Driver");
            Connection con = DriverManager.getConnection("jdbc:postgresql://rosie.db.elephantsql.com:5432/mspgxcxr", "mspgxcxr", "yiUV914v2ToEMPbL1gi_sJ6V02YO6Hi1");
            Statement stmt = con.createStatement();

            // Select all data from manufacturer table
            ResultSet rs = stmt.executeQuery("select * from manufacturer");
            while (rs.next())
            {
                JSONObject record = new JSONObject();

                // Inserting key-value pairs into the json object
                record.put("id", rs.getInt("id"));
                record.put("name", rs.getString("name"));
                dbdata_manufacturer.add(record);

            }

            // Select all data from product_type table
            rs = stmt.executeQuery("select * from product_type");
            while (rs.next())
            {
                JSONObject record = new JSONObject();

                // Inserting key-value pairs into the json object
                record.put("id", rs.getInt("id"));
                record.put("name", rs.getString("name"));
                record.put("manufacturer_id", rs.getString("manufacturer_id"));
                dbdata_product_type.add(record);
            }

            // Select all data from product table
            rs = stmt.executeQuery("select * from product");
            while (rs.next())
            {
                JSONObject record = new JSONObject();

                // Inserting key-value pairs into the json object
                record.put("id", rs.getInt("id"));
                record.put("name", rs.getString("name"));
                record.put("image", rs.getString("image"));
                record.put("length", rs.getInt("length"));
                record.put("width", rs.getString("width"));
                record.put("product_type_id", rs.getString("product_type_id"));
                dbdata_product.add(record);
            }

            // Add all arrays to the dbdata_catalogue
            dbdata_catalogue.add(dbdata_manufacturer);
            dbdata_catalogue.add(dbdata_product_type);
            dbdata_catalogue.add(dbdata_product);

            con.close();
            out.print(dbdata_catalogue);

        }
        catch (Exception e)
        {
            out.println("Database connection not successful");
        }
    }
}
