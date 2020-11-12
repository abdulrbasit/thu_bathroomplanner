/**
 * This java servlet class retrieves data from the ajax post(save.js) and inserts the data into database tables cookie and plan.
 */

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

@WebServlet("/SavePlan")
public class SavePlan extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // Response set as html
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        // Retrieve data from ajax post
        String cookie = request.getParameter("CookieString");
        float area = Float.parseFloat(request.getParameter("area"));
        int layout = Integer.parseInt(request.getParameter("layout"));
        String products = request.getParameter("products");

        try {

            // Establish Database Connection
            Connection connection = DatabaseConnection.getConnection();
            Statement statement = connection.createStatement();
            Integer cookie_id = null;
            
            // Select max value of id from table cookie and increment it to store in cookie_id
            ResultSet resultSet = statement.executeQuery("select max(id) from cookie");
            while (resultSet.next()) {

                cookie_id = resultSet.getInt(1);

                // If cookie table is empty, set id to one
                if (cookie_id.equals(null)) cookie_id = 1;
                else cookie_id += 1;
            }

            // Insert data query for cookie table
            PreparedStatement preparedStatement = connection.prepareStatement(
                    "insert into cookie(id,cookie,area,room_layout) values (?,?,?,?)");
            preparedStatement.setInt(1, cookie_id);
            preparedStatement.setString(2, cookie);
            preparedStatement.setFloat(3, area);
            preparedStatement.setInt(4, layout);

            // Execute query
            preparedStatement.executeUpdate();

            // Insert data query for plan table
            preparedStatement = connection.prepareStatement(
                    "insert into plan(product,cookie_id) values (?,?)");
            preparedStatement.setString(1, products);
            preparedStatement.setInt(2, cookie_id);

            //Execute query
            preparedStatement.executeUpdate();

            // Close database connection
            connection.close();
            out.print("Save plan successful");

        } catch (Exception ex) {
            out.print("Save plan failed");
        }
        out.close();
    }
}
